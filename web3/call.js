const { web3 } = require('ara-context')()
const { get } = require('./contract')

/**
 * Calls an Ethereum contract function.
 * @param  {Object} opts
 * @param  {Array}  opts.abi
 * @param  {String} opts.address
 * @param  {String} opts.functionName
 * @param  {Array}  opts.arguments
 * @return {Mixed}
 * @throws {Error,TypeError}
 */
async function call(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object.')
  } else if (!opts.abi || !Array.isArray(opts.abi)) {
    throw new TypeError('Contract ABI must be valid object array.')
  } else if (!opts.address || !web3.utils.isAddress(opts.address)) {
    throw new TypeError('Address must be valid Ethereum address.')
  } else if (!opts.functionName || 'string' !== typeof opts.functionName) {
    throw new TypeError('Function name must be non-empty string.')
  } else if (opts.arguments && !Array.isArray(opts.arguments)) {
    throw new TypeError('Arguments is not a valid array.')
  }

  const { abi, address, functionName } = opts
  const deployed = get(abi, address)

  if (!Object.prototype.hasOwnProperty.call(deployed.methods, functionName)) {
    throw new Error('Methods does not contain', functionName)
  }

  const args = opts.arguments || []

  let result
  try {
    result = await deployed.methods[functionName](...args).call()
  } catch (err) {
    throw err
  }

  return result
}

module.exports = {
  call
}