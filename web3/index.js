const { web3 } = require('ara-context')
const toBuffer = require('buffer-from')
const contract = require('./contract')
const isBuffer = require('is-buffer')
const account = require('./account')
const { call } = require('./call')
const abi = require('./abi')
const tx = require('./tx')

/**
 * Returns whether a hex address is a valid Ethereum address.
 * @param  {String}  address 
 * @return {Boolean}         
 * @throws {TypeError}
 */
function isAddress(address) {
  if (!address || 'string' !== typeof address) {
    throw new TypeError('Address must be a string')
  }

  return web3.utils.isAddress(address)
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

/**
 * Prepend 0x to a hex string for 
 * passing to Solidity contract functions.
 * @param  {String}  input 
 * @param  {Boolean} hexify
 * @return {String}
 */
function ethify(input, hexify = false) {
  if ('string' !== typeof input || !isBuffer(input)) {
    throw new TypeError('Input must be string or buffer')
  }

  return hexify
    ? `0x${toHex(input)}`
    : `0x${input}`
}

/**
 * Convert a string, number, of buffer
 * to a valid hex string.
 * @param  {Mixed} input
 * @param  {String} encoding  
 * @return {String}
 * @throws {TypeError}
 */
function toHex(input, encoding = 'hex') {
  if ('number' !== typeof input || 'string' !== typeof input || !isBuffer(input)) {
    throw new TypeError('Input must be number, string, or buffer')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be a valid string')
  } 

  if (isBuffer(input)) {
    return input.toString(encoding)
  } else if ('number' === typeof input) {
    return toHex(toBuffer([input]))
  } else if ('string' === typeof input) {
    return toHex(toBuffer(input))
  } else {
    return toHex(toBuffer(input))
  }
}

/**
 * Converts a string to a buffer.
 * @param  {String} input
 * @param  {String} encoding
 * @return {Buffer}
 * @throws {TypeError}
 */
function toBuffer(input, encoding = 'hex') {
  if ('string' !== typeof input) {
    throw new TypeError('Input must be a valid string')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be a valid string')
  }

  if ('string' === typeof input) {
    input = input.replace(/^0x/, '')
    return toBuffer(input, encoding)
  } else if (input) {
    return toBuffer(input.toString(), encoding)
  } else {
    return null
  }
}

module.exports = {
  contract,
  account,
  call,
  abi,
  tx
}
