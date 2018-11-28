const test = require('ava')
const { call } = require('../../web3/call')
const { deploy, get, estimateGas } = require('../../web3/contract')
const createContext = require('ara-context')
const { create } = require('ara-identity')
const { writeIdentity } = require('ara-identity/util')
const testWithArg = require('../../build/contracts/Test1.json')
const testWithoutArg = require('../../build/contracts/Test2.json')

const {
  kPassword,
  getAccount,
  supplyAccount
} = require('./_util')

test.before(async (t) => {
  const identity = await create({ password: kPassword })
  await writeIdentity(identity)
  t.context = { account: identity.account }

  // give account some ETH to be able to deploy
  const ctx = createContext()
  await ctx.ready()
  const { web3 } = ctx
  const defaultAccounts = await web3.eth.getAccounts()
  const { address } = t.context.account
  const oneEthInWei = web3.utils.toWei('1', 'ether')
  ctx.close()
  await supplyAccount(address, defaultAccounts, oneEthInWei)

  // deploy test contract
  const { abi, bytecode } = testWithoutArg
  const options = await deploy({ account: identity.account, abi, bytecode })
  t.context = {
    account: identity.account,
    abi,
    address: options.contractAddress
  }
})

test('deploy(opts) invalid opts', async (t) => {
  const account = getAccount(t)

  // validate opts
  await t.throwsAsync(deploy(), TypeError, 'Expecting opts object.')

  // validate account
  await t.throwsAsync(deploy({ account: { } }), TypeError, 'Expecting valid Ethereum account object.')
  await t.throwsAsync(deploy({ account: 'myAccount' }), TypeError, 'Expecting valid Ethereum account object.')

  // validate abi
  await t.throwsAsync(deploy({ account, abi: { } }), TypeError, 'Contract ABI must be valid objects array.')
  await t.throwsAsync(deploy({ account, abi: 'myAbi' }), TypeError, 'Contract ABI must be valid objects array.')

  // validate bytecode
  const { abi, bytecode } = testWithoutArg
  const nonHexBytecode = Number(bytecode)
  await t.throwsAsync(deploy({ account, abi, bytecode: nonHexBytecode }))

  // validate args
  await t.throwsAsync(
    deploy({
      account, abi, bytecode, arguments: 'myArguments'
    }),
    TypeError, 'Arguments is not a valid array.'
  )
})

test.serial('deploy(opts) valid opts without constructor', async (t) => {
  const account = getAccount(t)
  const { abi, bytecode } = testWithoutArg
  const result = await deploy({ account, abi, bytecode })
  t.true('object' === typeof result)

  const { web3 } = createContext({ provider: false })
  const { address, jsonInterface } = result.options
  t.true(null !== address && web3.utils.isAddress(address))
  t.true(null !== jsonInterface && Array.isArray(jsonInterface))
})

test.serial('deploy(opts) valid opts with constructor', async (t) => {
  const account = getAccount(t)
  const defaultNumber = 666
  const result = await deploy({
    account,
    abi: testWithArg.abi,
    bytecode: testWithArg.bytecode,
    arguments: [ defaultNumber ]
  })
  t.true('object' === typeof result)

  const { jsonInterface: abi, address } = result.options
  const number = await call({ abi, address, functionName: 'getNumber' })
  t.is(Number(number), defaultNumber)
})

test.serial('get(abi, address) invalid params', async (t) => {
  // validate abi
  t.throws(() => get(), TypeError, 'Contract ABI must be valid object array.')
  t.throws(() => get('myAbi'), TypeError, 'Contract ABI must be valid object array.')

  const account = getAccount(t)
  const { abi, bytecode } = testWithoutArg
  const contract = await deploy({ account, abi, bytecode })

  // valiate address
  const { jsonInterface, address } = contract.options
  t.throws(() => get(jsonInterface, Number(address)), TypeError, 'Expecting valid Ethereum address.')
  t.throws(() => get(jsonInterface, address.slice(16)), TypeError, 'Expecting valid Ethereum address.')
})

test.serial('get(abi, address) valid get', async (t) => {
  const account = getAccount(t)
  const { abi, bytecode } = testWithoutArg
  const { options } = await deploy({ account, abi, bytecode })
  const { jsonInterface, address } = options
  const contract = get(jsonInterface, address)

  t.is(address, contract.options.address)
  t.deepEqual(jsonInterface, contract.options.jsonInterface)
})

test('estimateGas(opts) invalid opts', async (t) => {
  const account = getAccount(t)
  const { abi, bytecode } = testWithoutArg
  const { options } = await deploy({ account, abi, bytecode })

  // validate tx
  await t.throwsAsync(estimateGas(), TypeError, 'Expecting tx object')
  await t.throwsAsync(estimateGas('tx'), TypeError, 'Expecting tx to be of type object')

  // // validate estimateGas function
  const contract = get(abi, options.address)
  const tx = contract.methods.setNumber(40)
  delete tx.estimateGas
  await t.throwsAsync(estimateGas(tx), TypeError, 'Expecting estimateGas function on tx object')

  // validate opts
  await t.throwsAsync(estimateGas(tx, 'opts'), TypeError, 'Expecting opts to be of type object')
})

test('estimateGas(opts) valid opts', async (t) => {
  const { abi, address } = t.context
  const contract = get(abi, address)
  const tx = contract.methods.setNumber(40)
  const gasCost = await estimateGas(tx, { from: address })

  t.true('number' === typeof gasCost && gasCost > 0)
})
