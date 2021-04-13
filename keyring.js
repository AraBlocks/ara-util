const { MissingParamError } = require('./errors')
const { readFile } = require('fs')
const { resolve } = require('path')
const { unpack, keyRing, derive } = require('ara-network/keys')
const { lstat } = require('fs')
const { DID } = require('did-uri')
const crypto = require('ara-crypto')
const http = require('http')
const pify = require('pify')
const url = require('url')
const ss = require('ara-secret-storage')
const rc = require('ara-runtime-configuration')()

/**
 * Checks if a keyring exists on local system
 *
 * @param  {String} opts.keyring   Path to the keyring
 *
 * @return {Boolean}               Whether the keyring exists
 */
async function exists(keyring) {
  if (!keyring) {
    throw new MissingParamError({
      expected: 'keyring',
      actual: keyring,
      suggestion: 'setting `rc.network.identity.keyring`'
    })
  }

  try {
    const uri = url.parse(keyring)

    let result
    if ('http:' === uri.protocol && 'https:' === uri.protocol) {
      result = await http.request({ ...uri, method: 'HEAD' })
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
 * @param  {String} opts.identity   Identity of keyring owner
 * @param  {String} opts.network    Network name to be retrieved
 * @param  {String} opts.password   Password of the identity
 * @param  {String} [opts.keyring]  Path to keyring
 *
 * @return {Object} Unpacked keyring
 */
async function getSecret(opts) {
  if (!opts) {
    throw new MissingParamError({
      expected: 'opts',
      actual: null
    })
  } else if ('object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  } else if (!opts.network) {
    throw new MissingParamError({
      expected: 'opts.network',
      actual: opts,
    })
  }

  if (!opts.keyring) {
    throw new MissingParamError({
      expected: 'opts.keyring',
      actual: opts,
      suggestion: 'setting `rc.network.identity.keyring`'
    })
  } else if (!opts.password) {
    throw new MissingParamError({
      expected: 'opts.password',
      actual: opts
    })
  } else if (!opts.identity) {
    throw new MissingParamError({
      expected: 'opts.identity',
      actual: opts
    })
  }

  try {
    const parsedDID = new DID(opts.identity)
    const publicKey = Buffer.from(parsedDID.identifier, 'hex')

    opts.password = crypto.blake2b(Buffer.from(opts.password))

    const hash = crypto.blake2b(publicKey).toString('hex')
    const path = resolve(rc.network.identity.root, hash, 'keystore/ara')
    const idFile = await pify(readFile)(path, 'utf8')
    const keystore = JSON.parse(idFile)
    const secretKey = ss.decrypt(keystore, { key: opts.password.slice(0, 16) })

    if (!await exists(opts.keyring)) {
      throw new Error(`Could not find ${opts.keyring}`)
    }

    const keyring = keyRing(opts.keyring, { secret: secretKey })

    if (!await keyring.has(opts.network)) {
      throw new Error(`Could not find '${opts.network}' in ${opts.keyring}`)
    }

    const buffer = await keyring.get(opts.network)

    const unpacked = unpack({ buffer })

    const kp = derive({ secretKey, name: opts.network })
    return { identity: { publicKey: kp.publicKey, secretKey: kp.secretKey }, ...unpacked }
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
    throw new MissingParamError({
      expected: 'opts',
      actual: null
    })
  } else if ('object' !== typeof opts) {
    throw new TypeError('Passed `opts` are not object')
  } else if (!opts.network) {
    throw new MissingParamError({
      expected: 'opts.network',
      actual: opts,
    })
  }

  if (!opts.keyring) {
    throw new MissingParamError({
      expected: 'opts.keyring',
      actual: opts,
      suggestion: 'setting `rc.network.identity.keyring`'
    })
  } else if (!opts.secret) {
    throw new MissingParamError({
      expected: 'opts.secret',
      actual: opts
    })
  } else if (!opts.identity) {
    throw new MissingParamError({
      expected: 'opts.identity',
      actual: opts
    })
  } else if (!opts.password) {
    throw new MissingParamError({
      expected: 'opts.password',
      actual: opts
    })
  }

  try {
    const parsedDID = new DID(opts.identity)
    const publicKey = Buffer.from(parsedDID.identifier, 'hex')

    opts.password = crypto.blake2b(Buffer.from(opts.password))

    const hash = crypto.blake2b(publicKey).toString('hex')
    const path = resolve(rc.network.identity.root, hash, 'keystore/ara')
    const idFile = await pify(readFile)(path, 'utf8')
    const keystore = JSON.parse(idFile)
    const secretKey = ss.decrypt(keystore, { key: opts.password.slice(0, 16) })

    if (!await exists(opts.keyring)) {
      throw new Error(`Could not find ${opts.keyring}`)
    }

    const keyring = keyRing(opts.keyring, { secret: Buffer.from(opts.secret) })

    if (!await keyring.has(opts.network)) {
      throw new Error(`Could not find '${opts.network}' in ${opts.keyring}`)
    }

    const buffer = await keyring.get(opts.network)
    const unpacked = unpack({ buffer })

    return { identity: { publicKey, secretKey }, ...unpacked }
  } catch (e) {
    throw new Error(`Error occurred while getting public key of ${opts.network}: ${e}`)
  }
}

module.exports = {
  exists,
  getPublic,
  getSecret,
}
