/* eslint-disable import/no-unresolved */

const { create: createIdentity } = require('ara-identity')
const { kPassword, supplyAccount } = require('./_util')
const { writeIdentity } = require('ara-identity/util')
const { deploy } = require('../../web3/contract')
const createContext = require('ara-context')
const { call } = require('../../web3/call')
const tx = require('../../web3/tx')
const test = require('ava')

test.before(async (t) => {
  // create account
  const identity = await createIdentity({ password: kPassword })
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
  const { abi, bytecode } = require('../../build/contracts/Test2.json')
  const options = await deploy({ account, abi, bytecode })
  t.context = {
    address: options.contractAddress,
    abi,
    account
  }
})

test('call(opts) invalid opts', async (t) => {
  const { abi, address } = t.context
  const functionName = 'getNumber'

  // validate opts
  await t.throwsAsync(call(), TypeError, 'Expecting opts object.')

  // validate abi
  await t.throwsAsync(call({ }, TypeError, 'Contract ABI must be valid object array.'))
  await t.throwsAsync(call({ abi: 'myAbi' }), TypeError, 'Contract ABI must be valid object array.')

  // validate address
  await t.throwsAsync(call({ abi }), TypeError, 'Address must be valid Ethereum address.')
  await t.throwsAsync(call({ abi, address: 1234 }), TypeError, 'Address must be valid Ethereum address.')

  // validate functionName
  await t.throwsAsync(call({ abi, address, functionName: 1234 }), TypeError, 'Function name must be non-empty string.')
  await t.throwsAsync(call({ abi, address, functionName: 'doesntExist' }), Error, 'Method doesn\'t exist on ABI.')

  // validate arguments
  await t.throwsAsync(call({
    abi, address, functionName, arguments: 'myArg'
  }), TypeError, 'Arguments is not a valid array.')
})

test('call(opts) valid call', async (t) => {
  const { address, account, abi } = t.context

  const number = 667
  const { tx: transaction, ctx } = await tx.create({
    account,
    to: address,
    data: {
      abi,
      functionName: 'setNumber',
      values: [ number ]
    }
  })
  await tx.sendSignedTransaction(transaction)
  ctx.close()

  // test without arg
  let result = await call({ abi, address, functionName: 'getNumber' })
  t.is(Number(result), number)

  // test with arg
  const arg = 100
  result = await call({
    abi, address, functionName: 'getNumberArg', arguments: [ arg ]
  })
  t.is(Number(result), arg)
})
