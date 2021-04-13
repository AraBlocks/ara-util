const createContext = require('ara-context')
const tx = require('./tx')

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
  const ctx1 = createContext()
  await ctx1.ready()
  const { web3 } = ctx1

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
  const args = opts.arguments || []

  let contract
  try {
    const instance = new web3.eth.Contract(abi)
    contract = await instance
      .deploy({
        data: bytecode,
        arguments: args
      })
    const gasLimit = await contract.estimateGas()
    ctx1.close()

    const { tx: deployTx, ctx: ctx2 } = await tx.create({
      account,
      gasLimit,
      data: contract.encodeABI()
    })

    const contractAddress = await new Promise((resolve, reject) => {
      tx.sendSignedTransaction(
        deployTx,
        {
          onreceipt: ({ contractAddress: address }) => {
            resolve(address)
            ctx2.close()
          },
          onerror: (err) => reject(err)
        }
      )
    })
    return {
      contractAddress,
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
async function get(abi, address) {
  const ctx = createContext()
  await ctx.ready()
  const { web3 } = ctx

  if (!abi || !Array.isArray(abi)) {
    throw new TypeError('Contract ABI must be valid object array.')
  } else if (!address || !web3.utils.isAddress(address)) {
    throw new TypeError('Expecting valid Ethereum address.')
  }
  const contract = new web3.eth.Contract(abi, address)
  return {
    contract,
    ctx
  }
}

/**
 * Estimates the gas cost on an unsent transaction.
 * @param  {Object} transaction
 * @param  {Object} opts
 * @return {Number}
 * @throws {TypeError}
 */
async function estimateGas(transaction, opts) {
  if (!transaction || 'object' !== typeof transaction) {
    throw new TypeError('Expecting transaction object')
  } else if ('function' !== typeof transaction.estimateGas) {
    throw new TypeError('Expecting estimateGas function on transaction object')
  } else if (opts && 'object' !== typeof opts) {
    throw new TypeError('Expecting opts to be of type object')
  }

  return transaction.estimateGas(opts)
}

module.exports = {
  deploy,
  get,
  estimateGas
}
