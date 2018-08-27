const { KeyringError } = require('./errors')
const { keyRing } = require('ara-network/keys')
const { resolve } = require('path')
const { unpack } = require('ara-network/keys')
const { lstat } = require('fs') 
const pify = require('pify')
const rc = require('./rc')()

/**
 * Checks if a keyring exists on local system
 * 
 * @param  {String} keyring Path to the keyring
 * @return {Boolean} Whether the keyring exists
 */
async function keyringExists(keyring) {
  try {
    return Boolean(await pify(lstat)(resolve(rc.network.identity.keyring || keyring)))
  } catch (e) {
    throw new Error(`Error occurred while checking keyring ${keyring} existance`, e)
  }
}

/**
 * Retrieve secret keys of a specific key
 * 
 * @param  {String} did Identity of keyring owner
 * @param  {String} key Name of key to be retrieved
 * @param  {Object} opts.secret Secret for decrypting keyring
 * @param  {String} opts.password Password of the identity
 * @param  {String} [opts.keyring] Path to keyring
 * @return {Object} Unpacked keyring
 */
async function getSecret(did, key, opts) {
  if (!opts) {
    throw new Error('Missing `opts` for getting secret key')
  }

  if (opts && 'object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  }

  if (!opts.secret) {
    throw new KeyringError(`Missing \`secret\` for getting secret key of ${key}`)
  }

  if (!opts.password) {
    throw new KeyringError(`Missing \`password\` for getting secret key of ${key}`)
  }

  const parsedDID = new DID(did)
  const publicKey = Buffer.from(parsedDID.identifier, 'hex')

  password = crypto.blake2b(Buffer.from(opts.password))

  const hash = crypto.blake2b(publicKey).toString('hex')
  const path = resolve(rc.network.identity.root, hash, 'keystore/ara')
  const secret = Buffer.from(opts.secret)
  const keystore = JSON.parse(await pify(readFile)(path, 'utf8'))
  const secretKey = ss.decrypt(keystore, { key: password.slice(0, 16) })

  const keyring = keyRing(rc.network.identity.keyring || opts.keyring, { secret: secretKey })
  const buffer = await keyring.get(key)
  const unpacked = unpack({ buffer })

  return unpacked
}

/**
 * Retrieve public keys of a specific key
 * 
 * @param  {String} key Key to be retrieved from keyring
 * @param  {String} opts.secret Secret for decrypting keyring
 * @param  {String} [opts.keyring] Path to keyring
 * @return {Object} Unpacked keyring
 */
async function getPublic(key, opts) {
  if (!opts) {
    throw new Error('Missing `opts` for getting secret key')
  }

  if (opts && 'object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  }

  if (!opts.secret) {
    throw new KeyringError(`Missing \`secret\` for getting secret key of ${key}`)
  }

  const secret = Buffer.from(opts.secret)

  const keyring = keyRing(rc.network.identity.keyring || opts.keyring, { secret })

  const buffer = await keyring.get(key)
  const unpacked = unpack({ buffer })

  return unpacked
}

module.exports = {
  keyringExists,
  getPublic,
  getSecret,
}