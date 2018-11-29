const { abi, bytecode } = require('../../build/contracts/Test2.json')
const { writeIdentity } = require('ara-identity/util')
const { deploy } = require('../../web3/contract')
const createContext = require('ara-context')
const { create } = require('ara-identity')
const tx = require('../../web3/tx')
const test = require('ava')

const {
  kPassword,
  kRandomEthAddress,
  getAccount,
  supplyAccount
} = require('./_util')

test.before(async (t) => {
  const identity = await create({ password: kPassword })
  await writeIdentity(identity)
  const { account } = identity

  // give account some ETH to be able to deploy
  const ctx = createContext()
  await ctx.ready()
  const { web3 } = ctx
  const defaultAccounts = await web3.eth.getAccounts()
  const { address } = account
  const oneEthInWei = web3.utils.toWei('1', 'ether')
  ctx.close()
  await supplyAccount(address, defaultAccounts, oneEthInWei)

  // deploy
  const options = await deploy({ account, abi, bytecode })
  t.context = {
    address: options.contractAddress,
    abi,
    account
  }
})

test('create(opts, signTx) invalid opts', async (t) => {
  const initialAccount = getAccount(t)

  // invalid opts and account
  await t.throwsAsync(tx.create(), TypeError, 'Expecting opts object')
  await t.throwsAsync(tx.create({ }), TypeError, 'Expecting account to be valid Ethereum account object')
  await t.throwsAsync(tx.create({ account: 'myAccount' }), TypeError, 'Expecting account to be valid Ethereum account object')

  // invalid to
  const invalidAddress = kRandomEthAddress.slice(2)
  await t.throwsAsync(
    tx.create({ account: initialAccount, to: invalidAddress }),
    Error, 'Expecting \'to\' to be valid Ethereum address'
  )
  await t.throwsAsync(
    tx.create({ account: initialAccount, to: 123 }),
    TypeError, 'Expecting \'to\' to be valid Ethereum address'
  )
})

test('create(opts, signTx) valid signed tx', async (t) => {
  const account = getAccount(t)

  const { tx: signedTx, ctx: ctx1 } = await tx.create({ account, to: kRandomEthAddress })
  t.true('object' === typeof signedTx)
  t.true(signedTx.verifySignature())
  ctx1.close()

  const { tx: unsignedTx, ctx: ctx2 } = await tx.create({ account, to: kRandomEthAddress }, false)
  t.true('object' === typeof unsignedTx && null !== unsignedTx.raw)
  t.true('Transaction' === unsignedTx.constructor.name)
  ctx2.close()
})

test('sign(tx, privateKey) invalid params', async (t) => {
  const account = getAccount(t)
  const { tx: unsignedTx, ctx } = await tx.create({ account, to: kRandomEthAddress })
  ctx.close()

  // invalid tx
  t.throws(() => tx.sign(), TypeError, 'Expecting tx to be non-empty EthereumTx object')
  t.throws(() => tx.sign({ }), TypeError, 'Expecting tx to be non-empty EthereumTx object')

  // invalid privateKey
  t.throws(() => tx.sign(unsignedTx), TypeError, 'Expecting privateKey to be non-empty string')
  t.throws(() => tx.sign(unsignedTx, 123), TypeError, 'Expecting privateKey to be non-empty string or buffer')
  t.throws(() => tx.sign(unsignedTx, 123), TypeError, 'Expecting privateKey to be non-empty string or buffer')
})

test('sign(tx, privateKey) valid signing', async (t) => {
  const account = getAccount(t)
  const { tx: unsignedTx, ctx } = await tx.create({ account, to: kRandomEthAddress }, false)
  ctx.close()
  const { privateKey } = account
  const signedTx = tx.sign(unsignedTx, privateKey)

  t.true('object' === typeof signedTx)
  t.true(signedTx.verifySignature())
})

test('sendSignedTransaction(tx) invalid tx', async (t) => {
  const account = getAccount(t)

  await t.throwsAsync(tx.sendSignedTransaction(), TypeError, 'Tx object is not valid')
  await t.throwsAsync(tx.sendSignedTransaction({ }), TypeError, 'Tx object is not valid')

  const { tx: unsignedTx, ctx } = await tx.create({ account, to: kRandomEthAddress }, false)
  await t.throwsAsync(tx.sendSignedTransaction(unsignedTx))
  ctx.close()
})

test('sendSignedTransaction(tx) valid tx', async (t) => {
  const account = getAccount(t)
  const { tx: signedTx, ctx } = await tx.create({ account, to: kRandomEthAddress })
  const receipt = await tx.sendSignedTransaction(signedTx)
  ctx.close()
  t.true(null !== receipt && 'object' === typeof receipt)
  const { web3 } = createContext({ provider: false })
  t.true(receipt.transactionHash && web3.utils.isHex(receipt.transactionHash))
})

test('estimateCost(tx, denomination) invalid params', async (t) => {
  const { account } = t.context

  // validate tx object
  t.throws(() => tx.estimateCost(), TypeError, 'Tx object is not valid')
  t.throws(() => tx.estimateCost({ }), TypeError, 'Tx object is not valid')

  // validate denomination
  const { tx: transaction, ctx } = await tx.create({ account })
  t.throws(() => tx.estimateCost(transaction, ''), TypeError, 'Denomination must be non-empty string')
  t.throws(() => tx.estimateCost(transaction, 1), TypeError, 'Denomination must be non-empty string')
  t.throws(() => tx.estimateCost(transaction, 'nonExistentDenom'), Error, 'Denomination doesn\'t exist')
  ctx.close()
})

test('estimateCost(tx, denomination) valid params', async (t) => {
  // eslint-disable-next-line no-shadow
  const { address, account, abi } = t.context
  const { tx: transaction, ctx } = await tx.create({
    account,
    to: address,
    data: {
      abi,
      functionName: 'setNumber',
      values: [ 111 ]
    }
  })

  const costInEth = tx.estimateCost(transaction)
  t.true(costInEth && 'string' === typeof costInEth)

  const costInFinney = tx.estimateCost(transaction, 'finney')
  t.true(costInFinney && 'string' === typeof costInFinney)
  t.true(Number(costInEth) < Number(costInFinney))
  ctx.close()
})
