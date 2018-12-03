const bufferFrom = require('buffer-from')
const isBuffer = require('is-buffer')
const { deprecate } = require('util')

/**
 * Convert a String, Number or Buffer
 * to a valid hex string. Optionally
 * prepends '0x', which is useful for
 * passing to Solidity contract functions.
 *
 * @param {String|Buffer|Number} input
 * @param {String} opts.encoding
 * @param {Bool} opts.ethify
 *
 * @return {String}
 *
 * @throws {TypeError}
 */
function toHexString(input, opts = {}) {
  if ('object' !== typeof opts) {
    throw new TypeError('`opts` must be an Object')
  }

  const {
    encoding = 'hex',
    ethify = false
  } = opts

  if ('number' !== typeof input && 'string' !== typeof input && !isBuffer(input)) {
    throw new TypeError('Input must be Number, String, or Buffer')
  } else if (encoding && 'string' !== typeof encoding) {
    throw new TypeError('Encoding must be a valid String')
  }

  if (isBuffer(input)) {
    return (ethify) ? `0x${input.toString('hex')}` : input.toString('hex')
  } else if ('number' === typeof input) {
    return toHexString(bufferFrom([ input ], encoding), opts)
  } else {
    return toHexString(bufferFrom(input, encoding), opts)
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

  input = input.replace(/^0x/, '')
  return bufferFrom(input, encoding)
}

module.exports = {
  toBuffer,
  toHexString,
  toHexBuffer: deprecate((input, encoding) => toHexString(input, { encoding, ethify: false }), '`transform.toHexBuffer` is deprecated, use `transform.toHexString`')
}
