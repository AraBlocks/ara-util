const { createIdentityKeyPath } = require('ara-identity/key-path')
const hasDIDMethod = require('has-did-method')
const { blake2b } = require('ara-crypto')
const transform = require('./transform')
const ss = require('ara-secret-storage')
const context = require('ara-context')()
const { deprecate } = require('util')
const aid = require('ara-identity')
const { resolve } = require('path')
const errors = require('./errors')
const diduri = require('did-uri')
const web3 = require('./web3')
const pify = require('pify')
const fs = require('fs')
const os = require('os')

const kAraKeystore = 'keystore/ara'

const {
  kEd25519VerificationKey2018,
  kSecp256k1VerificationKey2018
} = require('ld-cryptosuite-registry')

const ETH_ADDRESS_LENGTH = 40

/**
 * Blake2b hashes a DID URI.
 * @param  {String} did
 * @param  {String} encoding
 * @return {String}
 * @throws {TypeError}
 */
function hashDID(did, encoding = 'hex') {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('DID to hash must be non-empty string.')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be of type string.')
  }

  did = getIdentifier(did)

  return hash(did, encoding)
}

/**
 * Gets the identifier from the DID URI
 * @param  {String} did
 * @return {String}
 * @throws {TypeError}
 */
function getIdentifier(did) {
  const uri = diduri.parse(aid.did.normalize(did))
  return uri.identifier
}

/**
 * Verifies if a password for an identity is correct
 * by attempting to decrypt the ARA keystore
 * @param  {Object}  opts
 * @param  {Object}  opts.ddo
 * @param  {String}  opts.password
 * @return {Boolean}
 * @throws {TypeError}
 */
async function isCorrectPassword(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object.')
  } else if (!opts.ddo || 'object' !== typeof opts.ddo) {
    throw new TypeError('Expecting valid DDO object on opts.')
  } else if (!opts.password || 'string' !== typeof opts.password) {
    throw new TypeError('Expecting password to be non-empty string.')
  }

  const { ddo } = opts
  const publicKeyHex = getDocumentKeyHex(ddo)
  const password = blake2b(Buffer.from(opts.password))

  const identityPath = resolve(createIdentityKeyPath(ddo), kAraKeystore)
  let secretKey
  try {
    const keys = JSON.parse(await pify(fs.readFile)(identityPath, 'utf8'))
    secretKey = ss.decrypt(keys, { key: password.slice(0, 16) })
  } catch (err) {
    return false
  }

  const publicKey = secretKey.slice(32).toString('hex')
  return publicKeyHex === publicKey
}

/**
 * Retrieves the ethereum address given a DID
 * @param  {String}  did
 * @param  {Object}  [keyringOpts]
 * @return {String}
 * @throws {TypeError}
 */
async function getAddressFromDID(did, keyringOpts = {}) {
  if (!did || 'string' !== typeof did) {
    throw new TypeError(`Expected DID to be a non-empty string. Got ${did}. Ensure identity exists.`)
  }
  try {
    const ddo = await aid.resolve(did, keyringOpts)

    const { publicKeyHex } = ddo.publicKey.find((element) => {
      const { type } = element
      return type === kSecp256k1VerificationKey2018
    })
    const hashpk = web3.sha3(`0x${publicKeyHex}`)
    return web3.ethify(hashpk.slice(-ETH_ADDRESS_LENGTH))
  } catch (err) {
    throw err
  }
}

/**
 * Get the creating owner of an identity
 * @param  {Object} ddo
 * @return {String}
 * @throws {TypeError,RangeError}
 */
function getDocumentOwner(ddo) {
  if (!ddo || 'object' !== typeof ddo) {
    throw new TypeError('Expecting valid DDO object.')
  }

  const doc = _getDocument(ddo)
  if (0 === doc.authentication.length) {
    throw new RangeError('Identity doesn\'t list an owner in authentication.')
  }

  // eslint-disable-next-line arrow-body-style
  const { publicKey } = doc.authentication.find(({ type }) => {
    return type === kEd25519VerificationKey2018
  })

  const id = publicKey.slice(0, publicKey.indexOf('#'))
  return getIdentifier(id)
}

/**
 * Extracts the publicKey, or raw identifier, from a DDO.
 * @param  {Object} ddo
 * @return {String}
 * @throws {TypeError}
 */
function getDocumentKeyHex(ddo) {
  if (!ddo || 'object' !== typeof ddo) {
    throw new TypeError('Expecting valid DDO object.')
  }

  const doc = _getDocument(ddo)
  const { publicKeyHex } = doc.publicKey[0]

  return publicKeyHex
}

/**
 * Blake2b hash a string
 * @param  {String} str
 * @param  {String} encoding
 * @return {String}
 * @throws {TypeError}
 */
function hash(str, encoding = 'hex') {
  if (!str || 'string' !== typeof str) {
    throw new TypeError('Expecting input to be valid string.')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be of type string.')
  } else if (0 === Buffer.from(str, encoding).length) {
    throw new Error(`${str} with ${encoding} results in an empty buffer`)
  }

  const result = blake2b(Buffer.from(str, encoding))
  if ('hex' === encoding) {
    return transform.toHexString(result)
  }
  return result.toString(encoding)
}

/**
 * Recreates an owning identity
 * @param  {Object} opts
 * @param  {String} opts.did
 * @param  {String} opts.mnemonic
 * @param  {String} opts.password
 * @param  {Object} [opts.keyringOpts]
 * @return {Object}
 * @throws {TypeError}
 */
async function getAFSOwnerIdentity(opts) {
  let err
  if (!opts || 'object' !== typeof opts) {
    err = new TypeError('Expecting opts object.')
  } else if (!opts.did || 'string' !== typeof opts.did) {
    err = new TypeError('Expecting DID URI to be valid string.')
  } else if (!opts.mnemonic || 'string' !== typeof opts.mnemonic) {
    err = new TypeError('Expecting mnemonic to be valid string.')
  } else if (!opts.password || 'string' !== typeof opts.password) {
    err = new TypeError('Expecting password to be valid string.')
  }

  if (err) {
    throw err
  }

  const {
    did, mnemonic, password, keyringOpts = {}
  } = opts
  const ddo = await aid.resolve(did, keyringOpts)
  const owner = getDocumentOwner(ddo)
  return aid.create({
    context, mnemonic, owner, password
  })
}

/**
 * Checks if an AFS exists in local files
 *
 * @param  {Object} opts
 * @param  {String} opts.did    DID of AFS to check for
 *
 * @return {Boolean}      Whether AFS exists locally
 */
function checkAFSExistence(opts) {
  if (!opts) {
    throw new Error('Expecting opts to be defined, got null')
  } else if ('object' !== typeof opts) {
    throw new TypeError('Expecting opts to be an Object')
  } else if (!opts.did) {
    throw new Error(`Expecting opts.did to be defined, got ${JSON.stringify(opts)}`)
  }

  const { did } = opts

  try {
    const hashedDid = hashDID(did).toString('hex')

    // If the file exists, an error will be thrown
    fs.accessSync(resolve(`${os.homedir()}/.ara/afs`, hashedDid))
    return true
  } catch (e) {
    return false
  }
}

/**
 * Resolves a DID, validates ownership by comparing
 * passwords and returns the DDO.
 * @param  {Object} opts
 * @param  {String} opts.password
 * @param  {String} opts.did
 * @param  {Object} [opts.ddo]
 * @param  {Object} [opts.keyringOpts]
 * @return {Object}
 * @throws {Error,TypeError}
 */
async function validate(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object.')
  } else if (!opts.did || 'string' !== typeof opts.did) {
    throw new TypeError('DID URI must be valid string.')
  }

  let { did, ddo } = opts
  const { password, keyringOpts = {} } = opts

  try {
    did = getIdentifier(did)
  } catch (err) {
    throw err
  }

  if (!ddo) {
    ddo = await aid.resolve(did, keyringOpts)
  }

  if (!ddo) {
    throw new TypeError('Unable to resolve DID.')
  }

  const writable = Boolean(password)
  if (writable) {
    if (!(await isCorrectPassword({ ddo, password }))) {
      throw new Error('Incorrect password.')
    }
  }

  return {
    did,
    ddo
  }
}

function _getDocument(ddo) {
  return ddo.didDocument ? ddo.didDocument : ddo
}

module.exports = {
  getAFSOwnerIdentity,
  checkAFSExistence,
  isCorrectPassword,
  getAddressFromDID,
  getDocumentKeyHex,
  getDocumentOwner,
  hasDIDMethod,
  normalize: deprecate(getIdentifier, '`normalize` is deprecated, use `getIdentifier`'),
  getIdentifier,
  transform,
  validate,
  hashDID,
  errors,
  hash,
  web3
}
