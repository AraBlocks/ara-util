const { create: createAFS } = require('ara-filesystem')
const { create } = require('ara-identity')
const { writeIdentity } = require('ara-identity/util')
const context = require('ara-context')()
const { parse } = require('did-uri')
const test = require('ava')
const util = require('../')

const kPassword = 'myPass'
const kAidPrefix = 'did:ara:'

const getDDO = t => t.context.ddo

test.before(async (t) => {
  const identity = await create({ context, password: kPassword })
  await writeIdentity(identity)
  const { ddo } = identity
  t.context = { identity, ddo }
})

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
  t.throws(() => util.hashDID(), TypeError)
  t.throws(() => util.hashDID(1234), TypeError)
  t.throws(() => util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e', 1234), TypeError)
  t.throws(() => util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e', 'wrongEncoding'), TypeError)
})

test('hashIdentity(did, encoding) valid identity', (t) => {
  const { web3 } = context
  let result = util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))

  result = util.hashDID('14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))
})

test('normalize(did) invalid did', (t) => {
  t.throws(() => util.normalize(), TypeError)
  t.throws(() => util.normalize(1234), TypeError)
})

test('normalize(did) valid normalize', (t) => {
  let normalized = util.normalize('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
  t.true(!normalized.includes(kAidPrefix))

  normalized = util.normalize('14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
  t.true(!normalized.includes(kAidPrefix))
})

test('isCorrectPassword(opts) invalid opts', async (t) => {
  const ddo = getDDO(t)
  await t.throws(util.isCorrectPassword(), TypeError)
  await t.throws(util.isCorrectPassword({ }), TypeError)
  await t.throws(util.isCorrectPassword({ ddo }), TypeError)
  await t.throws(util.isCorrectPassword({ ddo, password: 123 }), TypeError)
})

test('isCorrectPassword(opts) valid check', async (t) => {
  const ddo = getDDO(t)
  let correct = await util.isCorrectPassword({ ddo, password: 'wrongPass' })
  t.false(correct)

  correct = await util.isCorrectPassword({ ddo, password: kPassword })
  t.true(correct)
})

test('getDocumentOwner(ddo) invalid ddo', (t) => {
  const ddo = getDDO(t)
  t.throws(() => util.getDocumentOwner(), TypeError)
  t.throws(() => util.getDocumentOwner('identity'), TypeError)
  t.throws(() => util.getDocumentOwner(ddo), RangeError)
})

test('getDocumentOwner(ddo) valid ddo', async (t) => {
  const ddo = getDDO(t)
  const owner = util.getDID(ddo)
  const { afs } = await createAFS({ owner, password: kPassword })
  const { ddo: afsDdo } = afs

  const docOwner = util.getDocumentOwner(afsDdo)
  t.is(docOwner, parse(owner).identifier)
})

test('getDocumentKeyHex(ddo) invalid ddo', (t) => {
  t.throws(() => util.getDocumentKeyHex(), TypeError)
  t.throws(() => util.getDocumentKeyHex('did:ara:1234'), TypeError)
})

test('getDocumentKeyHex(ddo) valid ddo', (t) => {
  const ddo = getDDO(t)
  const { web3 } = context
  const publicKeyHex = util.getDocumentKeyHex(ddo)
  t.true(publicKeyHex && 'string' === typeof publicKeyHex)
  t.true(web3.utils.isHex(publicKeyHex))
})

test('hash(str, encoding) invalid', (t) => {
  t.throws(() => util.hash(), TypeError)
  t.throws(() => util.hash(1234), TypeError)
  t.throws(() => util.hash('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e', 'wrongEncoding'))
})

test('hash(str, encoding) valid hash', (t) => {
  const did = '14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e'
  const { web3 } = context
  const hashed = util.hash(did)
  t.true(hashed && 'string' === typeof hashed)
  t.true(web3.utils.isHex(hashed))
})

test('resolveDDOWithKeystore(did) invalid did', async (t) => {
  await t.throws(util.resolveDDOWithKeystore(), TypeError)
  await t.throws(util.resolveDDOWithKeystore(123), TypeError)
})

test('resolveDDOWithKeystore(did) resolution', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const resolvedDDO = await util.resolveDDOWithKeystore(did)
  t.is(ddo.publicKey[0].owner, resolvedDDO.publicKey[0].owner)
})

test('getAFSOwnerIdentity(opts) invalid opts', async (t) => {
  await t.throws(util.getAFSOwnerIdentity(), TypeError)
  await t.throws(util.getAFSOwnerIdentity({ }), TypeError)
  await t.throws(util.getAFSOwnerIdentity({ did: 'did:ara:1234' }), TypeError)

  await t.throws(util.getAFSOwnerIdentity({
    did: 'did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e',
    mnemonic: 1234
  }))
  await t.throws(util.getAFSOwnerIdentity({
    did: 'did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e',
    mnemonic: 'this is a mnemonic this is a mnemonic this is a mnemonic',
  }))
  await t.throws(util.getAFSOwnerIdentity({
    did: 'did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e',
    mnemonic: 'this is a mnemonic this is a mnemonic this is a mnemonic',
    password: 1234
  }))
})

test('getAFSOwnerIdentity(opts) correct opts', async (t) => {
  const identity = await create({ context, password: kPassword })
  const { mnemonic, did } = identity
  const owner = did.did
  const { afs } = await createAFS({ owner, password: kPassword })
  const resolvedOwner = await util.getAFSOwnerIdentity({ did: afs.did, mnemonic, password: kPassword })

  t.is(identity.account.address, resolvedOwner.account.address)
})

test('validate(opts) invalid opts', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  await t.throws(util.validate(), TypeError)
  await t.throws(util.validate('opts'), TypeError)
  await t.throws(util.validate({ }), TypeError)
  await t.throws(util.validate({ did: null, password: kPassword }), TypeError)
  await t.throws(util.validate({ did: 'did', owner: 'owner', password: kPassword }))
  await t.throws(util.validate({ did, password: 'wrongPass' }), Error)
})

test('validate(opts)', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const result = await util.validate({ did, password: kPassword })
  t.true(result && 'object' === typeof result)
  t.is(result.did, did.slice(kAidPrefix.length))
})
