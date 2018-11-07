const createContext = require('ara-context')
const { get } = require('./contract')
console.log('in call')

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
  let { web3 } = createContext({ loadProvider: false })
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
  console.log('before get')
  const { contract: deployed, ctx } = await get(abi, address)
  console.log('after get')
  if (!Object.prototype.hasOwnProperty.call(deployed.methods, functionName)) {
    throw new Error('Methods does not contain', functionName)
  }

  const args = opts.arguments || []

  let result
  try {
    // const ctx = createContext()
    // await new Promise((resolve, reject) => {
    //     ctx.once('ready', () => {
    //       console.log('call ctx ready')
    //     resolve()
    //   })
    // })
    console.log('before call')
    // console.log(ctx)
    result = await deployed.methods[functionName](...args).call()
    console.log('after call')
    // context.close()
    ctx.close()
  } catch (err) {
    throw err
  }
  return result
}

module.exports = {
  call
}
