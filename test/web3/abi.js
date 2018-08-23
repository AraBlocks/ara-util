const test = require('ava')
const { web3 } = require('ara-context')()
const { abi } = require('../../build/contracts/Test1.json')

const {
  encodeFunctionCall,
  encodeParameter,
  encodeParameters
} = require('../../web3/abi')

test('encodeFunctionCall() invalid params', (t) => {
  t.throws(() => encodeFunctionCall(), TypeError)
  t.throws(() => encodeFunctionCall('abi'), TypeError)
  t.throws(() => encodeFunctionCall({ }), TypeError)
  t.throws(() => encodeFunctionCall(abi), TypeError)
  t.throws(() => encodeFunctionCall(abi, ''), TypeError)
  t.throws(() => encodeFunctionCall(abi, { }), TypeError)
  t.throws(() => encodeFunctionCall(abi, 123), TypeError)

  t.throws(() => encodeFunctionCall(abi, 'setNumber'), Error)
  t.throws(() => encodeFunctionCall(abi, 'setNumber', { }), Error)
  t.throws(() => encodeFunctionCall(abi, 'setNumber', ''), Error)
  t.throws(() => encodeFunctionCall(abi, 'setNumber', [ 1, 2, 3 ]), Error)
})

test('encodeFunctionCall() valid encode', (t) => {
  const encoded = encodeFunctionCall(abi, 'setNumber', [ 100 ])
  t.true(encoded && web3.utils.isHex(encoded))
})

test('encodeParameter() invalid params', (t) => {
  t.throws(() => encodeParameter(), TypeError)
  t.throws(() => encodeParameter({ }), TypeError)
  t.throws(() => encodeParameter(1234), TypeError)
  t.throws(() => encodeParameter('bytes'), TypeError)
})

test('encodeParameter() valid encode', (t) => {
  const encoded = encodeParameter('string', 'hello')
  t.true(encoded && web3.utils.isHex(encoded))
})

test('encodeParameters() invalid params', (t) => {
  t.throws(() => encodeParameters(), TypeError)
  t.throws(() => encodeParameters([]), TypeError)
  t.throws(() => encodeParameters({ }), TypeError)
  t.throws(() => encodeParameters(''), TypeError)
  t.throws(() => encodeParameters(['bytes', 'number']), TypeError)
  t.throws(() => encodeParameters(['bytes'], [1, 2]), Error)
  t.throws(() => encodeParameters(['string'], [ 111 ]), Error)
  t.throws(() => encodeParameters(
    ['bytes', 'number'],
    'parameters'
  ), TypeError)

  t.throws(() => encodeParameters(
    ['bytes', 'number'],
    123
  ), TypeError)

  t.throws(() => encodeParameters(
    ['bytes', 'number'],
    { }
  ), TypeError)
})

test('encodeParameters() valid encode', (t) => {
  const encoded = encodeParameters(['bytes', 'string'], ['0xFF', 'Hello'])
  t.true(encoded && web3.utils.isHex(encoded))
})
