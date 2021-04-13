const test = require('ava')

const { kEthHexPrefix } = require('./fixtures/constants')
const { transform } = require('..')

const kAddress = 'ef61059258414a65bf2d94a4fd3b503b5fee8b48'

test('toHexString(input) invalid input', (t) => {
  t.throws(() => transform.toHexString(), { instanceOf: TypeError })
  t.throws(() => transform.toHexString({ }), { instanceOf: TypeError })
  t.throws(() => transform.toHexString([]), { instanceOf: TypeError })
  t.throws(
    () => transform.toHexString(kAddress, 123),
    { instanceOf: TypeError }
  )
})

test('toHexString(input) valid input', (t) => {
  let result = transform.toHexString(10)
  t.is(result, '0a')
  result = transform.toHexString('hi', { encoding: 'utf8' })
  t.is(result, '6869')
  result = transform.toHexString(Buffer.from('hi'), { encoding: 'utf8' })
  t.is(result, '6869')
  result = transform.toHexString(kAddress, { encoding: 'hex', ethify: true })
  t.is(result, `${kEthHexPrefix}${kAddress}`)
  const buffer = Buffer.from(kAddress, 'hex')
  result = transform.toHexString(buffer, { encoding: 'hex', ethify: true })
  t.is(result, `${kEthHexPrefix}${kAddress}`)
})

test('toBuffer(input) invalid input', (t) => {
  t.throws(() => transform.toBuffer(), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer({ }), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer([]), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(123), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(false), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(kAddress, { }), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(kAddress, 123), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(kAddress, []), { instanceOf: TypeError })
  t.throws(() => transform.toBuffer(kAddress, true), { instanceOf: TypeError })
})

test('toBuffer(input) valid input', (t) => {
  let result = transform.toBuffer('123')
  t.deepEqual(result, Buffer.from('123', 'hex'))
  result = transform.toBuffer(kAddress)
  t.deepEqual(result, Buffer.from(kAddress, 'hex'))
  result = transform.toBuffer('hi')
  t.deepEqual(result, Buffer.from('hi', 'hex'))
})
