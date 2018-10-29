const { toHexString, toBuffer } = require('../transform')
const { deprecate } = require('util')
const { web3 } = require('ara-context')()
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

  return web3.utils.soliditySha3(params)
}

module.exports = {
  ethify: deprecate((i, h) => {
    if (h) return toHexString(i, 'utf8', true)
    else return toHexString(i, 'hex', true)
  }, '`web3.ethify` is deprecated, use `toHexString` in `ara-util/transform`'),
  toBuffer: deprecate(toBuffer, '`web3.toBuffer` is deprecated, use `toBuffer` in `ara-util/transform`'),
  toHex: deprecate((i, e) => toHexString(i, e, false), '`web3.toHex` is deprecated, use `toHexString` in `ara-util/transform`'),
  isAddress,
  contract,
  account,
  call,
  sha3,
  abi,
  tx
}
