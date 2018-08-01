const { web3 } = require('ara-context')()
const test = require('ava')
const util = require('../')

test('loadSecretsKeystore(key, public) invalid params', async (t) => {
  await t.throws(util.loadSecretsKeystore(), TypeError)
  await t.throws(util.loadSecretsKeystore(111), TypeError)
})

test('loadSecretsKeystore(key, public) valid params', async (t) => {
  const keystore = await util.loadSecretsKeystore('resolver')
  t.true('object' === typeof keystore)
  t.true(Boolean(keystore.crypto))
})

test('hashIdentity(did, encoding) invalid params', (t) => {
  t.throws(() => util.hashIdentity(), TypeError)
  t.throws(() => util.hashIdentity(1234), TypeError)
  t.throws(() => util.hashIdentity('did:ara:1234', 1234), TypeError)
  t.throws(() => util.hashIdentity('did:ara:1234', 'wrongEncoding'), TypeError)
})

test('hashIdentity(did, encoding) valid identity', (t) => {
  const result = util.hashDID('did:ara:1234')
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))
})

test('normalize(did) invalid did', (t) => {
  t.throws(() => util.normalize(), TypeError)
  t.throws(() => util.normalize(1234), TypeError)
  t.throws(() => util.normalize('1234'), Error)
  t.throws(() => util.normalize('did:1234'), Error)
})
