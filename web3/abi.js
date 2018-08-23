const { web3 } = require('ara-context')()

/**
 * Encodes a deployed contract's function into an ABI signature
 * @param  {Object} abi
 * @param  {String} name
 * @param  {Array} values
 * @return {String}
 * @throws {Error}
 */
function encodeFunctionCall(abi, functionName, values) {
  const jsonInterface = abi.find(f => functionName === f.name)
  const { inputs } = jsonInterface

  if (values.length !== inputs.length) {
    throw new Error('Provided args count does not match ABI count')
  }

  return web3.eth.abi.encodeFunctionCall(jsonInterface, values)
}

/**
 * ABI encodes a function parameter
 * @param  {String} type
 * @param  {Mixed} parameter
 * @return {String}
 * @throws {TypeError}
 */
function encodeParameter(type, parameter) {
  if (!type || 'string' !== typeof type) {
    throw new TypeError('Type must be valid string')
  }

  return web3.eth.abi.encodeParameter(type, parameter)
}

/**
 * ABI encodes function parameters
 * @param  {Array|Object} typesArray
 * @param  {Array}        parameters
 * @return {String}
 * @throws {TypeError}
 */
function encodeParameters(typesArray, parameters) {
  if (!typesArray || !Array.isArray(typesArray) || 'object' !== typeof typesArray) {
    throw new TypeError('Types array must be array or object containing JSON interface')
  } else if (!parameters || !Array.isArray(parameters)) {
    throw new TypeError('Parameters must be valid array')
  }

  return web3.eth.abi.encodeParameters(typesArray, parameters)
}

module.exports = {
  encodeFunctionCall,
  encodeParameter,
  encodeParameters
}
