const context = require('ara-context')()
const ethereum = require('ara-identity/ethereum')
const { parse } = require('did-uri')

/**
 * Loads a local Ethereum account
 * @param {Object} opts
 * @param {String} opts.did
 * @param {String} opts.password
 * @return {Object} account object
 * @throws TypeError, Error
 */
async function load(opts) {
  if (null === opts || !opts) {
    throw new TypeError('Expecting opts object')
  }

  if (!opts.did || 'string' !== typeof opts.did) {
    throw new TypeError('Expecting DID URI to be non-empty string')
  }

  if (!opts.password || 'string' !== typeof opts.password) {
    throw new TypeError('Expecting password to be non-empty string')
  }

  let spec
  try {
    // validate DID
    spec = parse(opts.did)
  } catch (err) {
    throw new Error(err)
  }

  // need DID without method
  const { identifier: publicKey } = spec
  const { password } = opts
  const { web3 } = context

  let account
  try {
    account = await ethereum.account.load({
      web3,
      publicKey,
      password
    })
  } catch (err) {
    throw new Error(err)
  }

  return account
}

module.exports = {
  load
}
