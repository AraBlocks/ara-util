const { web3 } = require('ara-context')()

/**
 * Deploys a new contract to the provided network.
 * @param  {Object} opts
 * @param  {Object} opts.account
 * @param  {Array}  opts.abi
 * @param  {String} opts.bytecode
 * @param  {Array}  opts.arguments
 * @return {Object}
 * @throws {Error,TypeError}
 */
async function deploy(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object.')
  } else if (!opts.account || 'object' !== typeof opts.account) {
    throw new TypeError('Expecting valid Ethereum account object.')
  } else if (!opts.abi || !Array.isArray(opts.abi)) {
    throw new TypeError('Contract ABI must be valid object array.')
  } else if (!opts.bytecode || !web3.utils.isHex(opts.bytecode)) {
    throw new TypeError('Bytecode is not valid hex.')
  } else if (opts.arguments && !Array.isArray(opts.arguments)) {
    throw new TypeError('Arguments is not a valid array.')
  }

  const { account, abi, bytecode } = opts
  const { address } = account
  const args = opts.arguments || []

  let contract
  let result
  try {
    const instance = new web3.eth.Contract(abi)
    contract = await instance
      .deploy({
        data: bytecode,
        arguments: args
      })
    const gasLimit = await contract.estimateGas()
    return {
      contract: await contract.send({
        from: address,
        gas: gasLimit
      }),
      gasLimit
    }
  } catch (err) {
    throw err
  }
}

/**
 * Gets a deployed contract instance.
 * @param  {Array}  abi
 * @param  {String} address
 * @return {Object}
 * @throws {TypeError}
 */
function get(abi, address) {
  if (!abi || !Array.isArray(abi)) {
    throw new TypeError('Contract ABI must be valid object array.')
  } else if (!address || !web3.utils.isAddress(address)) {
    throw new TypeError('Expecting valid Ethereum address.')
  }

  return new web3.eth.Contract(abi, address)
}

/**
 * Estimates the gas cost on an unsent transaction.
 * @param  {Object} opts
 * @param  {Object} opts.tx
 * @return {Number}
 * @throws {TypeError}
 */
async function estimateGas(tx, opts) {
  if (!tx || 'object' !== typeof tx) {
    throw new TypeError('Expecting tx object')
  } else if ('function' !== typeof tx.estimateGas) {
    throw new TypeError('Expecting estimateGas function on tx object')
  } else if (opts && 'object' !== typeof opts) {
    throw new TypeError('Expecting opts to be of type object')
  }

  return tx.estimateGas(opts)
}

module.exports = {
  deploy,
  get,
  estimateGas
}
