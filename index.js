const crypto = require('ara-crypto')
const hasDIDMethod = require('has-did-method')
const kAidPrefix = 'did:ara:'
const kIdentifierLength = 64

function hashIdentity(did, encoding = 'hex') {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('ara-util.hashIdentity: DID to hash must be non-empty string')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('ara-util.hashIdentity: Encoding must be of type string')
  }

  return crypto.blake2b(Buffer.from(did, encoding))
    .toString(encoding)
}

function normalize(did) {
  if (!did || 'string' !== typeof did) {
    throw new TypeError('ara-util.normalize: DID URI to normalize must be non-empty string')
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

// TODO
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

  // TODO
  
  return false
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

function _getDocument(ddo) {
  return ddo.didDocument ? ddo.didDocument : ddo
}

module.exports = {
  isCorrectPassword,
  getDocumentKeyHex,
  getDocumentOwner,
  hasDIDMethod,
  hashIdentity,
  normalize,
}
