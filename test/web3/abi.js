/* eslint-disable import/no-unresolved */

const createContext = require('ara-context')
const test = require('ava')

const { abi } = require('../../build/contracts/Test1.json')

const {
  encodeFunctionCall,
  encodeParameter,
  encodeParameters
} = require('../../web3/abi')

test('encodeFunctionCall() invalid params', (t) => {
  t.throws(() => encodeFunctionCall(), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall('abi'), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall({ }), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall(abi), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall(abi, ''), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall(abi, { }), { instanceOf: TypeError })
  t.throws(() => encodeFunctionCall(abi, 123), { instanceOf: TypeError })

  t.throws(() => encodeFunctionCall(abi, 'setNumber'), { instanceOf: Error })
  t.throws(() => encodeFunctionCall(abi, 'setNumber', { }), { instanceOf: Error })
  t.throws(() => encodeFunctionCall(abi, 'setNumber', ''), { instanceOf: Error })
  t.throws(() => encodeFunctionCall(abi, 'setNumber', [ 1, 2, 3 ]), { instanceOf: Error })
})

test('encodeFunctionCall() valid encode', (t) => {
  const encoded = encodeFunctionCall(abi, 'setNumber', [ 100 ])
  const { web3 } = createContext({ provider: false })
  t.true(encoded && web3.utils.isHex(encoded))
})

test('encodeParameter() invalid params', (t) => {
  t.throws(() => encodeParameter(), { instanceOf: TypeError })
  t.throws(() => encodeParameter({ }), { instanceOf: TypeError })
  t.throws(() => encodeParameter(1234), { instanceOf: TypeError })
  t.throws(() => encodeParameter('bytes'), { instanceOf: TypeError })
})

test('encodeParameter() valid encode', (t) => {
  const encoded = encodeParameter('string', 'hello')
  const { web3 } = createContext({ provider: false })
  t.true(encoded && web3.utils.isHex(encoded))
})

test('encodeParameters() invalid params', (t) => {
  t.throws(() => encodeParameters(), { instanceOf: TypeError })
  t.throws(() => encodeParameters([]), { instanceOf: TypeError })
  t.throws(() => encodeParameters({ }), { instanceOf: TypeError })
  t.throws(() => encodeParameters(''), { instanceOf: TypeError })
  t.throws(() => encodeParameters([ 'bytes', 'number' ]), { instanceOf: TypeError })
  t.throws(() => encodeParameters([ 'bytes' ], [ 1, 2 ]), { instanceOf: Error })
  // t.throws(() => encodeParameters([ 'string' ], [ 111 ]), { instanceOf: Error })
  t.throws(() => encodeParameters(
    [ 'bytes', 'number' ],
    'parameters'
  ), { instanceOf: TypeError })

  t.throws(() => encodeParameters(
    [ 'bytes', 'number' ],
    123
  ), { instanceOf: TypeError })

  t.throws(() => encodeParameters(
    [ 'bytes', 'number' ],
    { }
  ), { instanceOf: TypeError })
})

test('encodeParameters() valid encode', (t) => {
  const encoded = encodeParameters([ 'bytes', 'string' ], [ '0xFF', 'Hello' ])
  const { web3 } = createContext({ provider: false })
  t.true(encoded && web3.utils.isHex(encoded))
})
