const { MissingOptionError } = require('./error')
const { readFile } = require('fs')
const { resolve } = require('path')
const { unpack, keyRing } = require('ara-network/keys')
const { lstat } = require('fs')
const { DID } = require('did-uri')
const crypto = require('ara-crypto')
const http = require('http')
const pify = require('pify')
const url = require('url')
const rc = require('./rc')()
const ss = require('ara-secret-storage')

/**
 * Checks if a keyring exists on local system
 *
 * @param  {String} opts.keyring   Path to the keyring
 * 
 * @return {Boolean}               Whether the keyring exists
 */
async function exists(keyring) {
  keyring = keyring || rc.network.identity.keyring
  if (!keyring) {
    throw new MissingOptionError({
      expectedKey: 'keyring',
      actualValue: keyring,
      suggestion: 'setting `rc.network.identity.keyring`'
    })
  }

  try {
    const uri = url.parse(keyring)

    let result
    if ('http:' === uri.protocol && 'https:' === uri.protocol) {
      result = await http.request(Object.assign({}, uri, { method: 'HEAD' }))
    } else {
      result = await pify(lstat)(resolve(keyring))
    }

    return Boolean(result)
  } catch (e) {
    throw new Error(`Error occurred while checking keyring ${keyring} existence`, e)
  }
}

/**
 * Retrieve secret keys of a specific key
 *
 * @param  {String} opts.did        Identity of keyring owner
 * @param  {String} opts.network    Network name to be retrieved
 * @param  {String} opts.password   Password of the identity
 * @param  {String} [opts.keyring]  Path to keyring
 * 
 * @return {Object} Unpacked keyring
 */
async function getSecret(opts) {
  if (!opts) {
    throw new Error('Missing `opts` for getting secret key')
  }

  if ('object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  }

  if (!opts.network) {
    throw new Error('Missing `network` for getting secret key')
  }

  opts.keyring = opts.keyring || rc.network.identity.keyring
  if (!opts.keyring) {
    throw new Error(`Missing \`keyring\` opt and default keyring for getting secret key of ${opts.network}`)
  }

  if (!opts.password) {
    throw new Error(`Missing \`password\` for getting secret key of ${opts.network}`)
  }

  if (!opts.did) {
    throw new Error(`Missing \`did\` for getting secret key of ${opts.network}`)
  }

  try {
    const parsedDID = new DID(opts.did)
    const publicKey = Buffer.from(parsedDID.identifier, 'hex')

    opts.password = crypto.blake2b(Buffer.from(opts.password))

    const hash = crypto.blake2b(publicKey).toString('hex')
    const path = resolve(rc.network.identity.root, hash, 'keystore/ara')
    const idFile = await pify(readFile)(path, 'utf8')
    const keystore = JSON.parse(idFile)
    const secretKey = ss.decrypt(keystore, { key: opts.password.slice(0, 16) })

    const keyring = keyRing(opts.keyring, { secret: secretKey })
    const buffer = await keyring.get(opts.network)
    const unpacked = unpack({ buffer })

    return unpacked
  } catch (e) {
    throw new Error(`Error occurred while getting secret key of ${opts.network} (${e})`)
  }
}

/**
 * Retrieve public keys of a specific key
 *
 * @param  {String} opts.network     Network name to be retrieved from keyring
 * @param  {String} opts.secret      Secret for decrypting keyring
 * @param  {String} [opts.keyring]   Path to keyring
 * 
 * @return {Object}                  Unpacked keyring
 */
async function getPublic(opts) {
  if (!opts) {
    throw new Error('Missing `opts` for getting public key')
  }

  if (opts && 'object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  }

  if (!opts.network) {
    throw new Error('Missing `network` for getting public key')
  }

  opts.keyring = opts.keyring || rc.network.identity.keyring
  if (!opts.keyring) {
    throw new Error(`Missing \`keyring\` opt and default keyring for getting secret key of ${opts.network}`)
  }

  if (!opts.secret) {
    throw new Error(`Missing \`secret\` for getting public key of ${opts.network}`)
  }

  try {
    const secret = Buffer.from(opts.secret)
    const keyring = keyRing(opts.keyring, { secret })
    const buffer = await keyring.get(opts.network)
    const unpacked = unpack({ buffer })

    return unpacked
  } catch (e) {
    throw new Error(`Error occurred while getting public key of ${opts.network}`)
  }
}

module.exports = {
  exists,
  getPublic,
  getSecret,
}
