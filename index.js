const { createIdentityKeyPath } = require('ara-identity/key-path')
const { toHex } = require('ara-identity/util')
const hasDIDMethod = require('has-did-method')
const { secrets } = require('ara-network')
const { parse } = require('did-uri')
const crypto = require('ara-crypto')
const aid = require('ara-identity')
const { resolve } = require('path')
const pify = require('pify')
const fs = require('fs')

// constants
const kAraKeystore = 'keystore/ara'
const kResolverKey = 'resolver'
const kAidPrefix = 'did:ara:'
const kIdentifierLength = 64

/**
 * Load the keystore for a local secrets file.
 * @param  {String}  key    
 * @param  {Boolean} public 
 * @return {Object}         
 * @throws {TypeError}
 */
async function loadSecretsKeystore(key, public = true) {
  if (!key || 'string' !== typeof key) {
    throw new TypeError('ara-util.loadSecretsKeystore: Key must be non-empty string')
  }
  const s = await secrets.load({ key, public })
  const { keystore } = s.public
  return keystore
}

/**
 * Blake2b hashes a DID URI.
 * @param  {String} did      
 * @param  {String} encoding 
 * @return {String}          
 * @throws {TypeError}
 */
function hashDID(did, encoding = 'hex') {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('ara-util.hashDID: DID to hash must be non-empty string')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('ara-util.hashDID: Encoding must be of type string')
  }

  return crypto.blake2b(Buffer.from(did, encoding))
    .toString(encoding)
}

function normalize(did) {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('ara-util.normalize: DID URI to normalize must be non-empty string')
  }

  try {
    parse(did)
  } catch (err) {
    throw err
  }

  if (hasDIDMethod(did)) {
    if (0 !== did.indexOf(kAidPrefix)) {
      throw new TypeError('ara-util.normalize: Expecting a DID URI with an "ara" method.')
    } else {
      did = did.substring(kAidPrefix.length)
      if (kIdentifierLength !== did.length) {
        throw new Error('ara-util.normalize: DID is not %d characters', kIdentifierLength)
      }
    }
  }
  return did
}

async function isCorrectPassword(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('ara-util.isCorrectPassword: Expecting opts object')
  } else if (!opts.ddo || 'object' !== typeof opts.ddo) {
    throw new TypeError('ara-util.isCorrectPassword: Epecting valid DDO object on opts')
  } else if (!opts.password || 'string' !== typeof opts.password) {
    throw new TypeError('ara-util.isCorrectPassword: Expecting password to be non-empty string')
  }

  const { ddo } = opts
  const publicKeyHex = getDocumentKeyHex(ddo)
  const password = crypto.blake2b(Buffer.from(opts.password))

  const identityPath = resolve(createIdentityKeyPath(ddo), kAraKeystore)
  let secretKey
  try {
    const keys = JSON.parse(await pify(fs.readFile)(identityPath, 'utf8'))
    secretKey = crypto.decrypt(keys, { key: password.slice(0, 16) })
  } catch (err) {
    return false
  }
  
  const publicKey = secretKey.slice(32).toString('hex')
  return publicKeyHex === publicKey
}

function getDocumentOwner(ddo) {
  if (!ddo || 'object' !== typeof ddo) {
    throw new TypeError('ara-util.getDocumentOwner: Expecting valid DDO object')
  }

  const doc = _getDocument(ddo)
  const { authenticationKey } = doc.authentication[0]

  const id = authenticationKey.slice(0, authenticationKey.indexOf('#') - 1)
  return normalize(id)
}

function getDocumentKeyHex(ddo) {
  if (!ddo || 'object' !== typeof ddo) {
    throw new TypeError('ara-util.getPublicKeyHex: Expecting valid DDO object')
  }

  const doc = _getDocument(ddo)
  const { publicKeyHex } = doc.publicKey[0]

  return publicKeyHex
}

function hash(str, encoding = 'hex') {
  if (!str || 'string' !== typeof str) {
    throw new TypeError('ara-util.hash: Expecting input to be valid string')
  } else if (encoding && 'string' !== encoding) {
    throw new TypeError('ara-util.hash: Encoding must be of type string')
  }

  return toHex(crypto.blake2b(Buffer.from(str, encoding)))
}

async function resolveDDOWithKeystore(did) {
  if (!did || 'string' !== did) {
    throw new TypeError('ara-util.resolveDDOWithKeystore: DID URI must be valid string')
  }

  const keystore = await loadSecretsKeystore(kResolverKey)
  return aid.resolve(did, { key: kResolverKey, keystore })
}

async function getAFSOwnerIdentity(opts) {
  let err
  if (!opts || 'object' !== typeof opts) {
    err = new TypeError('ara-util.getAFSOwnerIdentity: Expecting opts object')
  } else if (!opts.did || 'string' !== typeof opts.did) {
    err = new TypeError('ara-util.getAFSOwnerIdentity: Expecting DID URI to be valid string')
  } else if (!opts.mnemonic || 'string' !== typeof opts.mnemonic) {
    err = new TypeError('ara-util.getAFSOwnerIdentity: Expecting mnemonic to be valid string')
  } else if (!opts.password || 'string' !== typeof opts.password) {
    err = new TypeError('ara-util.getAFSOwnerIdentity: Expecting password to be valid string')
  }

  if (err) {
    throw err
  }

  const { did, mnemonic, password } = opts
  const ddo = await resolveDDOWithKeystore(did)
  const owner = getDocumentOwner(ddo)
  return aid.create({ mnemonic, owner, password })
}

async function validate(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('ara-util.validate: Expecting opts object')
  } else if (!opts.password || 'string' !== typeof opts.password) {
    throw new TypeError('ara-util.validate: Expecting password to be non-empty string')
  }

  const { did, owner, password } = opts
  if (did && owner) { 
    throw new Error(`ara-util.validate: Expecting an AFS DID or an owner DID, but not both`)
  }

  if (owner) { 
    did = owner
  }

  if (!did || 'string' !== typeof did) {
    throw new TypeError('ara-util.validate: DID URI must be valid string')
  }

  try {
    did = normalize(did)
  } catch (err) {
    throw err
  }

  const ddo = await resolveDDOWithKeystore(did)
  if (!ddo) {
    throw new TypeError('ara-util.validate: Unable to resolve DID')
  }

  const writable = Boolean(password) || Boolean(owner)
  if (writable) {
    if (!(await isCorrectPassword({ ddo, password }))) {
      throw new Error(`ara-util.validate: Incorrect password`)
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
  resolveDDOWithKeystore,
  getAFSOwnerIdentity,
  loadSecretsKeystore,
  isCorrectPassword,
  getDocumentKeyHex,
  getDocumentOwner,
  hasDIDMethod,
  hashDID,
  normalize,
  hash
}
