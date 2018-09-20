const bufferFrom = require('buffer-from')
const isBuffer = require('is-buffer')

/**
 * Prepend 0x to a hex string
 *
 * Useful for passing to Solidity contract functions.
 * 
 * @param  {String}  input 
 * @param  {Boolean} hexify
 * 
 * @return {String}
 */
function toHexString(input, hexify = false) {
  if ('string' !== typeof input && !isBuffer(input)) {
    throw new TypeError('Input must be String or Buffer')
  }

  return hexify
    ? `0x${toHex(input)}`
    : `0x${input}`
}

/**
 * Convert a String, Number or Buffer
 * to a valid hex string.
 * 
 * @param {String|Buffer|Number} input
 * @param {String} encoding
 * 
 * @return {String}
 * 
 * @throws {TypeError}
 */
function toHexBuffer(input, encoding = 'hex') {
  if ('number' !== typeof input && 'string' !== typeof input && !isBuffer(input)) {
    throw new TypeError('Input must be Number, String, or Buffer')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be a valid String')
  } 

  if (isBuffer(input)) {
    return input.toString(encoding)
  } else if ('number' === typeof input) {
    return toHex(bufferFrom([ input ]))
  } else if ('string' === typeof input) {
    return toHex(bufferFrom(input))
  } else {
    return toHex(bufferFrom(input))
  }
}

/**
 * Converts a string to a buffer.
 * 
 * @param  {String} input
 * @param  {String} encoding
 * 
 * @return {Buffer}
 * 
 * @throws {TypeError}
 */
function toBuffer(input, encoding = 'hex') {
  if ('string' !== typeof input) {
    throw new TypeError('Input must be a String')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be a String')
  }

  if ('string' === typeof input) {
    input = input.replace(/^0x/, '')
    return bufferFrom(input, encoding)
  } else if (input) {
    return bufferFrom(input.toString(), encoding)
  } else {
    return null
  }
}

module.exports = {
  toBuffer,
  toHexBuffer,
  toHexString
}