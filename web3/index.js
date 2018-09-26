const { toHexString, toHexBuffer, toBuffer: _toBuffer } = require('../transform')
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

function toBuffer(input, encoding = 'hex') {
  console.warn('`web3.toBuffer` is deprecated, use `toBuffer` in `ara-util/transform`')

  return _toBuffer(input, encoding)
}

function toHex(input, encoding = 'hex') {
  console.warn('`web3.toHex` is deprecated, use `toHexBuffer` in `ara-util/transform`')

  return toHexBuffer(input, encoding)
}

function ethify(input, hexify = false) {
  console.warn('`web3.ethify` is deprecated, use `toHexString` in `ara-util/transform`')

  return toHexString(input, hexify)
}

module.exports = {
  isAddress,
  toBuffer,
  contract,
  account,
  ethify,
  toHex,
  call,
  sha3,
  abi,
  tx
}
