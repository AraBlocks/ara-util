const { toHexString, toBuffer } = require('../transform')
const { deprecate } = require('util')
const createContext = require('ara-context')
const contract = require('./contract')
const account = require('./account')
const { call } = require('./call')
const abi = require('./abi')
const tx = require('./tx')
/**
 * Returns whether a hex address is a valid Ethereum address.
 * @param  {String}  address
 * @return {Boolean}
 */
function isAddress(address) {
  const { web3 } = createContext({ provider: false })
  return Boolean(address && 'string' === typeof address && web3.utils.isAddress(address))
}

/**
 * ABI encodes and SHA3 hashes input.
 * @param  {Mixed} params
 * @return {String}
 * @throws {Error}
 */
function sha3(params) {
  if (!params || 0 === arguments.length) {
    throw new Error('Must provide arguments or object')
  }
  const { web3 } = createContext({ provider: false })

  return web3.utils.soliditySha3(params)
}

/**
 * Returns an Ara context object containing a Web3 instance
 * @param  {Boolean} provider - Whether a Web3 provider should be created
 * @return {Object}
 */
function getContext(provider = true) {
  return createContext({ provider })
}

module.exports = {
  getContext,
  ethify: deprecate((input, hexify) => {
    if (hexify) return toHexString(input, { encoding: 'utf8', ethify: true })
    return toHexString(input, { encoding: 'hex', ethify: true })
  }, '`web3.ethify` is deprecated, use `transform.toHexString`'),
  toBuffer: deprecate(toBuffer, '`web3.toBuffer` is deprecated, use `transform.toBuffer`'),
  toHex: deprecate((input, encoding) => toHexString(input, { encoding, ethify: false }), '`web3.toHex` is deprecated, use `transform.toHexString`'),
  isAddress,
  contract,
  account,
  call,
  sha3,
  abi,
  tx
}
