const createContext = require('ara-context')

/**
 * Encodes a deployed contract's function into an ABI signature
 * @param  {Object} abi
 * @param  {String} name
 * @param  {Array} values
 * @return {String}
 * @throws {Error,TypeError}
 */
function encodeFunctionCall(abi, functionName, values) {
  if (!abi || 'object' !== typeof abi || !Array.isArray(abi)) {
    throw new TypeError('ABI must be an array')
  } else if (!functionName || 'string' !== typeof functionName) {
    throw new TypeError('Function Name must be of type string')
  } else if (values && ('object' !== typeof values || !Array.isArray(values))) {
    throw new TypeError('Values must be an array')
  }

  const jsonInterface = abi.find(f => functionName === f.name)
  const { inputs } = jsonInterface

  values = values || []

  if (values && values.length !== inputs.length) {
    throw new Error('Provided args count does not match ABI count')
  }
  // const ctx = createContext()
  // new Promise((resolve, reject) => {
  //     ctx.once('ready', () => {
  //     resolve()
  //   })
  // })
  // const { web3 } = ctx
  let { web3 } = createContext({ loadProvider: false })
  const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(jsonInterface, values)
  // ctx.close()
  return encodedFunctionCall
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
  } else if (!parameter) {
    throw new TypeError('Parameter cannot be null')
  }
  // const ctx = createContext()
  // new Promise((resolve, reject) => {
  //     ctx.once('ready', () => {
  //     resolve()
  //   })
  // })
  // const { web3 } = ctx
  let { web3 } = createContext({ loadProvider: false })
  const encodedParameter = web3.eth.abi.encodeParameter(type, parameter)
  // ctx.close()
  return encodedParameter
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
  // const ctx = createContext()
  // new Promise((resolve, reject) => {
  //     ctx.once('ready', () => {
  //     resolve()
  //   })
  // })
  // const { web3 } = ctx
  let { web3 } = createContext({ loadProvider: false })
  const encodedParameters = web3.eth.abi.encodeParameters(typesArray, parameters)
  // ctx.close()
  return encodedParameters
}

module.exports = {
  encodeFunctionCall,
  encodeParameter,
  encodeParameters
}
