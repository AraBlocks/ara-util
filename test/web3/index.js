const test = require('ava')
const { web3 } = require('../../')

const kAddress = 'ef61059258414a65bf2d94a4fd3b503b5fee8b48'

test('isAddress(address) invalid input', (t) => {
  t.false(web3.isAddress())
  t.false(web3.isAddress({ }))
  t.false(web3.isAddress(123))
  t.false(web3.isAddress([]))
})

test('isAddress(address) valid input', (t) => {
  let result = web3.isAddress('0xef61059258414a65bf2d94a4fd3b503b5fee8b48')
  t.true(result)
  result = web3.isAddress('not_an_address')
  t.false(result)
})

test('sha3(params) invalid input', (t) => {
  t.throws(() => web3.sha3(), Error)
  t.throws(() => web3.sha3(null), Error)
})

test('sha3(params) valid input', (t) => {
  let result = web3.sha3(123)
  t.true(result && 'string' === typeof result)
  result = web3.sha3({ param1: 1, param2: 2 })
  t.true(result && 'string' === typeof result)
})

test('ethify(input) invalid input', (t) => {
  t.throws(() => web3.ethify(), TypeError)
  t.throws(() => web3.ethify({ }), TypeError)
  t.throws(() => web3.ethify([]), TypeError)
})

test('ethify(input) valid conversion', (t) => {
  let result = web3.ethify(kAddress)
  t.is(result, `0x${kAddress}`)

  const buffer = Buffer.from(kAddress, 'hex')
  result = web3.ethify(buffer)
  t.is(result, `0x${kAddress}`)
})

test('toHex(input) invalid input', (t) => {
  t.throws(() => web3.toHex(), TypeError)
  t.throws(() => web3.toHex({ }), TypeError)
  t.throws(() => web3.toHex([]), TypeError)
  t.throws(() => web3.toHex(kAddress, { }), TypeError)
  t.throws(() => web3.toHex(kAddress, 123), TypeError)
  t.throws(() => web3.toHex(kAddress, []), TypeError)
})

test('toHex(input)', (t) => {
  let result = web3.toHex(10)
  t.is(result, '0a')
  result = web3.toHex('hi', 'utf8')
  t.is(result, '6869')
  result = web3.toHex(Buffer.from('hi'), 'utf8')
  t.is(result, '6869')
})

test('toBuffer(input) invalid input', (t) => {
  t.throws(() => web3.toBuffer(), TypeError)
  t.throws(() => web3.toBuffer({ }), TypeError)
  t.throws(() => web3.toBuffer([]), TypeError)
  t.throws(() => web3.toBuffer(kAddress, { }), TypeError)
  t.throws(() => web3.toBuffer(kAddress, 123), TypeError)
  t.throws(() => web3.toBuffer(kAddress, []), TypeError)
})

test('toBuffer(input) valid input', (t) => {
  let result = web3.toBuffer('123')
  t.deepEqual(result, Buffer.from('123', 'hex'))
  result = web3.toBuffer(kAddress)
  t.deepEqual(result, Buffer.from(kAddress, 'hex'))
  result = web3.toBuffer('hi')
  t.deepEqual(result, Buffer.from('hi', 'hex'))
})
