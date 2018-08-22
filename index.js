const { createIdentityKeyPath } = require('ara-identity/key-path')
const { toHex } = require('ara-identity/util')
const hasDIDMethod = require('has-did-method')
const { blake2b } = require('ara-crypto')
const ss = require('ara-secret-storage')
const context = require('ara-context')()
const { secret } = require('./rc')()
const aid = require('ara-identity')
const { resolve } = require('path')
const web3 = require('./web3')
const pify = require('pify')
const fs = require('fs')

const kAraKeystore = 'keystore/ara'

const {
  kIdentifierLength,
  kResolverSecret,
  kResolverName,
  kAidPrefix
} = require('./constants')

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

  did = normalize(did)

  return hash(did, encoding)
}

/**
 * Normalizes a DID URI into just the identifier
 * @param  {String} did
 * @return {String}
 * @throws {TypeError}
 */
function normalize(did) {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('DID URI to normalize must be non-empty string.')
  }

  if (hasDIDMethod(did)) {
    if (0 !== did.indexOf(kAidPrefix)) {
      throw new TypeError('Expecting a DID URI with an "ara" method.')
    } else {
      did = did.substring(kAidPrefix.length)
      if (kIdentifierLength !== did.length) {
        throw new Error(`ara-util.normalize: DID is not ${kIdentifierLength} characters`)
      }
    }
  }
  return did
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
  const { authenticationKey } = doc.authentication[0]

  const id = authenticationKey.slice(0, authenticationKey.indexOf('#'))
  return normalize(id)
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
  }

  const result = blake2b(Buffer.from(str, encoding))
  if ('hex' === encoding) {
    return toHex(result)
  }
  return result.toString(encoding)
}

/**
 * Resolves an identity
 * @param  {String} did
 * @return {Object}
 * @throws {TypeError}
 */
async function resolveDDO(did, opts) {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('DID URI must be valid string.')
  }

  opts = opts || {
    name: kResolverName,
    secret: kResolverSecret,
    keyring: secret.resolver
  }
  return aid.resolve(did, opts)
}

/**
 * Recreates an owning identity
 * @param  {Object} opts
 * @param  {String} opts.did
 * @param  {String} opts.mnemonic
 * @param  {String} opts.password
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

  const { did, mnemonic, password } = opts
  const ddo = await resolveDDO(did)
  const owner = getDocumentOwner(ddo)
  return aid.create({
    context, mnemonic, owner, password
  })
}

/**
 * Resolves a DID, validates ownership by comparing
 * passwords and returns the DDO.
 * @param  {Object} opts
 * @param  {String} opts.password
 * @param  {String} [opts.did]
 * @param  {String} [opts.owner]
 * @return {Object}
 * @throws {Error,TypeError}
 */
async function validate(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object.')
  }

  let { did } = opts
  const { owner, password } = opts
  if (did && owner) {
    throw new Error('Expecting an AFS DID or an owner DID, but not both.')
  }

  if (owner) {
    did = owner
  }

  if (!did || 'string' !== typeof did) {
    throw new TypeError('DID URI must be valid string.')
  }

  try {
    did = normalize(did)
  } catch (err) {
    throw err
  }

  const ddo = await resolveDDO(did)
  if (!ddo) {
    throw new TypeError('Unable to resolve DID.')
  }

  const writable = Boolean(password) || Boolean(owner)
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

/**
 * Extracts the DID from a DDO
 * @param  {Object} ddo
 * @return {String}
 * @throws {TypeError}
 */
function getDID({ id }) {
  if (!id || 'object' !== typeof id) {
    throw new TypeError('Cannot find DID on DDO.')
  }

  const { did } = id
  return did
}

function _getDocument(ddo) {
  return ddo.didDocument ? ddo.didDocument : ddo
}

module.exports = {
  getAFSOwnerIdentity,
  isCorrectPassword,
  getDocumentKeyHex,
  getDocumentOwner,
  hasDIDMethod,
  resolveDDO,
  normalize,
  validate,
  hashDID,
  getDID,
  hash,
  web3
}
