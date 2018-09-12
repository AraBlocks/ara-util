const { create: createAFS } = require('ara-filesystem/create')
const { parse } = require('did-uri')
const context = require('ara-context')()
const keyring = require('../keyring')
const test = require('ava')
const util = require('../')
const fs = require('fs')
const rc = require('../rc')()

const AID_PREFIX = 'did:ara:'

const getDDO = t => t.context.ddo

test.before(async (t) => {
  t.context = {
    identity: rc.network.identity.whoami,
    keyring: rc.network.identity.keyring,
    secret: 'test',
    archiverNetworkName: 'archiver',
    password: 'c'
  }
})

test('hashIdentity(did, encoding) invalid params', (t) => {
  t.throws(() => util.hashDID(), TypeError)
  t.throws(() => util.hashDID(1234), TypeError)
  t.throws(() => util.hashDID(t.context.identity, 1234), TypeError)
  t.throws(() => util.hashDID(t.context.identity, 'wrongEncoding'), TypeError)
})

test('hashIdentity(did, encoding) valid identity', (t) => {
  const { web3 } = context
  let result = util.hashDID(t.context.identity)
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))

  result = util.hashDID(t.context.identity)
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))
})

test('normalize(did) invalid did', (t) => {
  t.throws(() => util.normalize(), TypeError)
  t.throws(() => util.normalize(1234), TypeError)
})

test('normalize(did) valid normalize', (t) => {
  let normalized = util.normalize(t.context.identity)
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

  correct = await util.isCorrectPassword({ ddo, password: t.context.password })
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
  const { afs } = await createAFS({ owner, password: t.context.password })
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
  t.throws(() => util.hash(t.context.identity, 'wrongEncoding'))
})

test('hash(str, encoding) valid hash', (t) => {
  const { web3 } = context
  const hashed = util.hash(t.context.identity)
  t.true(hashed && 'string' === typeof hashed)
  t.true(web3.utils.isHex(hashed))
})

test('resolveDDO(did) invalid did', async (t) => {
  await t.throws(util.resolveDDO(), TypeError)
  await t.throws(util.resolveDDO(123), TypeError)
})

test('resolveDDO(did) resolution', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const resolvedDDO = await util.resolveDDO(did)
  t.is(ddo.publicKey[0].owner, resolvedDDO.publicKey[0].owner)
})

test('getAFSOwnerIdentity(opts) invalid opts', async (t) => {
  await t.throws(util.getAFSOwnerIdentity(), TypeError)
  await t.throws(util.getAFSOwnerIdentity({ }), TypeError)
  await t.throws(util.getAFSOwnerIdentity({ did: 'did:ara:1234' }), TypeError)

  await t.throws(util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: 1234
  }))
  await t.throws(util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: 'this is a mnemonic this is a mnemonic this is a mnemonic',
  }))
  await t.throws(util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: 'this is a mnemonic this is a mnemonic this is a mnemonic',
    password: 1234
  }))
})

test('getAFSOwnerIdentity(opts) correct opts', async (t) => {
  const identity = await create({ context, password: t.context.password })
  const { mnemonic, did } = identity
  const owner = did.did
  const { afs } = await createAFS({ owner, password: t.context.password })
  const resolvedOwner = await util.getAFSOwnerIdentity({ did: afs.did, mnemonic, password: t.context.password })

  t.is(identity.account.address, resolvedOwner.account.address)
})

test('validate(opts) invalid opts', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  await t.throws(util.validate(), TypeError)
  await t.throws(util.validate('opts'), TypeError)
  await t.throws(util.validate({ }), TypeError)
  await t.throws(util.validate({ did: null, password: t.context.password }), TypeError)
  await t.throws(util.validate({ did: 'did', owner: 'owner', password: t.context.password }))
  await t.throws(util.validate({ did, password: 'wrongPass' }), Error)
})

test('validate(opts)', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const result = await util.validate({ did, password: t.context.password })
  t.true(result && 'object' === typeof result)
  t.is(result.did, did.slice(kAidPrefix.length))
})

// test.only('exists(opts) invalid opts', async (t) => {
//   await t.throws(() => { keyring.exists() }, Error)
// })

test.only('exists(opts)', async (t) => {
  t.true(await keyring.exists())
  t.true(await keyring.exists(rc.network.identity.keyring))
})

test.only('getSecret(opts) invalid opts', async (t) => {
  const password = t.context.password
  const network = t.context.archiverNetworkName 
  const keyring = t.context.keyring
  const secret = t.context.secret
  const did = t.context.identity

  await t.throws(() => { keyring.getSecret() }, TypeError)
  await t.throws(() => { keyring.getSecret({}) }, Error)
  await t.throws(() => { keyring.getSecret({ keyring }) }, Error)
  await t.throws(() => { keyring.getSecret({ keyring, secret }) }, Error)
  await t.throws(() => { keyring.getSecret({ keyring, secret, password }) }, Error)
  await t.throws(() => { keyring.getSecret({ keyring, secret, password, did }) }, Error)
})

test.only('getSecret(opts)', async (t) => {
  const secretKey = await keyring.getSecret({
    did: t.context.identity,
    secret: t.context.secret,
    keyring: t.context.keyring,
    password: t.context.password, 
    network: t.context.archiverNetworkName 
  })

  t.truthy(secretKey)
})

test('getPublic(opts) invalid opts', async (t) => {
  const network = t.context.archiverNetworkName 
  const keyring = t.context.keyring
  const secret = t.context.secret

  await t.throws(() => { keyring.getPublic() }, TypeError)
  await t.throws(() => { keyring.getPublic({}) }, Error)
  await t.throws(() => { keyring.getPublic({ keyring }) }, Error)
  await t.throws(() => { keyring.getPublic({ keyring, secret }) }, Error)
})

test('getPublic(opts)', async (t) => {
  const publicKey = await keyring.getPublic({
    secret: t.context.secret,
    keyring: t.context.keyring,
    network: t.context.archiverNetworkName 
  })

  t.truthy(publicKey)
})



// TODO(cckelly) getDID tests
