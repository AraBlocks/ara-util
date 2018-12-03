const { transform } = require('../')
const test = require('ava')

const kAddress = 'ef61059258414a65bf2d94a4fd3b503b5fee8b48'

test('toHexString(input) invalid input', (t) => {
  t.throws(() => transform.toHexString(), TypeError)
  t.throws(() => transform.toHexString({ }), TypeError)
  t.throws(() => transform.toHexString([]), TypeError)
  t.throws(() => transform.toHexString(kAddress, 123), TypeError)
})

test('toHexString(input) valid input', (t) => {
  let result = transform.toHexString(10)
  t.is(result, '0a')
  result = transform.toHexString('hi', { encoding: 'utf8' })
  t.is(result, '6869')
  result = transform.toHexString(Buffer.from('hi'), { encoding: 'utf8' })
  t.is(result, '6869')
  result = transform.toHexString(kAddress, { encoding: 'hex', ethify: true })
  t.is(result, `0x${kAddress}`)
  const buffer = Buffer.from(kAddress, 'hex')
  result = transform.toHexString(buffer, { encoding: 'hex', ethify: true })
  t.is(result, `0x${kAddress}`)
})

test('toBuffer(input) invalid input', (t) => {
  t.throws(() => transform.toBuffer(), TypeError)
  t.throws(() => transform.toBuffer({ }), TypeError)
  t.throws(() => transform.toBuffer([]), TypeError)
  t.throws(() => transform.toBuffer(123), TypeError)
  t.throws(() => transform.toBuffer(false), TypeError)
  t.throws(() => transform.toBuffer(kAddress, { }), TypeError)
  t.throws(() => transform.toBuffer(kAddress, 123), TypeError)
  t.throws(() => transform.toBuffer(kAddress, []), TypeError)
  t.throws(() => transform.toBuffer(kAddress, true), TypeError)
})

test('toBuffer(input) valid input', (t) => {
  let result = transform.toBuffer('123')
  t.deepEqual(result, Buffer.from('123', 'hex'))
  result = transform.toBuffer(kAddress)
  t.deepEqual(result, Buffer.from(kAddress, 'hex'))
  result = transform.toBuffer('hi')
  t.deepEqual(result, Buffer.from('hi', 'hex'))
})

test('deprecated toHexBuffer(input) invalid input', (t) => {
  t.throws(() => transform.toHexBuffer(), TypeError)
  t.throws(() => transform.toHexBuffer({ }), TypeError)
  t.throws(() => transform.toHexBuffer([]), TypeError)
  t.throws(() => transform.toHexBuffer(kAddress, 123), TypeError)
})

test('deprecated toHexBuffer(input) valid input', (t) => {
  let result = transform.toHexBuffer(10)
  t.is(result, '0a')
  result = transform.toHexBuffer('hi', 'utf8')
  t.is(result, '6869')
  result = transform.toHexBuffer(Buffer.from('hi'), 'utf8')
  t.is(result, '6869')
  result = transform.toHexBuffer(kAddress, 'hex')
  t.is(result, `${kAddress}`)
  const buffer = Buffer.from(kAddress, 'hex')
  result = transform.toHexBuffer(buffer, 'hex')
  t.is(result, `${kAddress}`)
})
