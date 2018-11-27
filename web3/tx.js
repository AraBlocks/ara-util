const { toBuffer } = require('../transform')
const { encodeFunctionCall } = require('./abi')
const EthereumTx = require('ethereumjs-tx')
const createContext = require('ara-context')
const isBuffer = require('is-buffer')

// 100,000
const kGasLimit = 100000

/**
 * Creates an EthereumTx object
 * @param  {Object}        opts
 * @param  {Object}        opts.account
 * @param  {String}        opts.to
 * @param  {Object}        opts.data
 * @param  {Object}        opts.data.abi
 * @param  {String}        opts.data.functionName
 * @param  {Array}         opts.data.values
 * @param  {String|Number} [opts.gasPrice]
 * @param  {String|Number} [opts.gasLimit]
 * @param  {Boolean}       signTx
 * @return {Object}
 */
async function create(opts, signTx = true) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('Expecting opts object')
  } else if (!opts.account || 'object' !== typeof opts.account) {
    throw new TypeError('Expecting account to be valid Ethereum account object')
  } else if (opts.gasPrice && ('string' !== typeof opts.gasPrice && 'number' !== typeof opts.gasPrice)) {
    throw new TypeError('Expecting gas price must be a string or number')
  }

  const ctx = createContext()
  await ctx.ready()
  const { web3 } = ctx
  if (opts.to && ('string' !== typeof opts.to || !web3.utils.isAddress(opts.to))) {
    throw new TypeError('Expecting \'to\' to be valid Ethereum address')
  }

  const { address, privateKey } = opts.account
  if (!address || (!privateKey && signTx)) {
    throw new TypeError('Account object expecting address and privateKey')
  }
  const nonce = await web3.eth.getTransactionCount(address)

  if (opts.gasPrice && 'number' === typeof opts.gasPrice) {
    opts.gasPrice = opts.gasPrice.toString()
  }

  const gasPrice = opts.gasPrice || await web3.eth.getGasPrice()
  const gasLimit = opts.gasLimit || kGasLimit
  const to = opts.to || undefined

  const txParams = {
    nonce,
    from: address,
    to,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit)
  }

  if (opts.data) {
    const isEncoded = web3.utils.isHex(opts.data)
    if (isEncoded) {
      txParams.data = opts.data
    } else {
      const { abi, functionName, values } = opts.data
      txParams.data = encodeFunctionCall(abi, functionName, values)
    }
  }

  let tx = new EthereumTx(txParams)
  if (signTx) {
    tx = sign(tx, privateKey)
  }

  return {
    tx,
    ctx
  }
}

/**
 * Sign an existing tx object with an account's private key
 * @param  {Object} tx
 * @param  {String|Buffer} privateKey
 * @return {String}
 * @throws {TypeError}
 */
function sign(tx, privateKey) {
  if (!tx || 'object' !== typeof tx || !(tx instanceof EthereumTx)) {
    throw new TypeError('Expecting tx to be non-empty EthereumTx object')
  }

  if (!privateKey || ('string' !== typeof privateKey && !isBuffer(privateKey))) {
    throw new TypeError('Expecting privateKey to be non-empty string or buffer')
  }

  if (!isBuffer(privateKey)) {
    privateKey = toBuffer(privateKey)
  }

  tx.sign(privateKey)

  return tx
}

/**
 * Send an unsigned transaction
 * @param  {Object} tx
 */
async function sendTransaction(tx) {
  if (!tx || 'object' !== typeof tx || !(tx instanceof EthereumTx)) {
    throw new TypeError('Tx object is not valid')
  }

  return _send(tx, false)
}

/**
 * Send a signed transaction
 * @param  {Object} tx
 */
async function sendSignedTransaction(tx) {
  if (!tx || 'object' !== typeof tx || !(tx instanceof EthereumTx)) {
    throw new TypeError('Tx object is not valid')
  }

  return _send(tx, true)
}

/**
 * Estimates the cost of a transaction in a particular denomination.
 * @param  {Object} tx
 * @param  {String} denomination
 * @return {String}
 * @throws {TypeError}
 */
function estimateCost(tx, denomination = 'ether') {
  if (!tx || 'object' !== typeof tx || !(tx instanceof EthereumTx)) {
    throw new TypeError('Tx object is not valid')
  } else if (!denomination || 'string' !== typeof denomination) {
    throw new TypeError('Denomination must be non-empty string')
  }

  const cost = tx.getUpfrontCost().toString()
  const { web3 } = createContext({ provider: false })
  return web3.utils.fromWei(cost, denomination)
}

/**
 * Send an existing transaction to the Ethereum network
 * @param  {Object} tx
 * @param  {Boolean} signed
 * @throws {Error}
 */
async function _send(tx, signed) {
  if (signed && !tx.verifySignature()) {
    throw new Error('Trying to send a signed transaction, but tx object is unsigned.')
  } else if (!signed && tx.verifySignature()) {
    throw new Error('Trying to send an unsigned transaction, but tx object is signed.')
  }
  const ctx = createContext()
  await ctx.ready()
  const { web3 } = ctx
  if (!_isSerialized(tx) && signed) {
    tx = web3.utils.bytesToHex(tx.serialize())
  }

  let result
  try {
    if (signed) {
      result = await web3.eth.sendSignedTransaction(tx)
    } else {
      result = await web3.eth.sendTransaction(tx)
    }
  } catch (err) {
    throw new Error(err.message)
  }
  ctx.close()
  return result
}

/**
 * Checks is a tx object has been serialized into hex
 * @param  {Object}  tx
 * @return {Boolean}
 */
function _isSerialized(tx) {
  const { web3 } = createContext({ provider: false })
  return 'string' === typeof tx && web3.utils.isHex(tx)
}

module.exports = {
  create,
  sign,
  sendTransaction,
  sendSignedTransaction,
  estimateCost
}
