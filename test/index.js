const constants = require('./fixtures/constants')
const { parse } = require('did-uri')
const context = require('ara-context')()
const sinon = require('sinon')
const test = require('ava')
const aid = require('ara-identity')
const fs = require('fs')
const ss = require('ara-secret-storage')
const rc = require('../rc')()

const getDDO = t => t.context.ddo

test.before((t) => {
  t.context = Object.assign({}, constants, {
    sandbox: sinon.createSandbox(),
    identity: rc.network.identity.whoami,
    keyring: rc.network.identity.keyring,
  })

  t.context.sandbox.stub(fs, 'readFile').callsFake((_, __, cb) => { 
    return cb(null, JSON.stringify(t.context.araKeystore))
  })

  t.context.sandbox.stub(fs, 'lstat').callsFake(() => ({ ctime: 10 }))

  t.context.sandbox.stub(aid, 'resolve').callsFake(() => t.context.ddo)

  t.context.sandbox.stub(aid, 'create').callsFake((opts) => {
    const { mnemonic, identity: owner, password } = t.context

    t.truthy(opts.context)
    t.truthy(opts.password)
    t.truthy(opts.identity)
    t.truthy(opts.mnemonic)

    t.is(opts.mnemonic, mnemonic)
    t.is(opts.owner, owner)
    t.is(opts.password, password)
  })
})

test.after((t) => {
  t.context.sandbox.restore()
})

// Do not move this. We have to import this last so we can stub methods
const util = require('../')

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
  const normalized = util.normalize(t.context.identity)

  t.true(!normalized.includes(t.context.aidPrefix))
})

test('isCorrectPassword(opts) invalid opts', async (t) => {
  const ddo = getDDO(t)

  await t.throwsAsync(util.isCorrectPassword, TypeError)
  await t.throwsAsync(util.isCorrectPassword({}), TypeError)
  await t.throwsAsync(util.isCorrectPassword({ ddo }), TypeError)
  await t.throwsAsync(util.isCorrectPassword({ ddo, password: 123 }), TypeError)
})

test('isCorrectPassword(opts) valid check', async (t) => {
  const ddo = getDDO(t)
  let correct = await util.isCorrectPassword({ ddo, password: 'wrongPass' })
  t.false(correct)

  correct = await util.isCorrectPassword({ ddo, password: t.context.password })
  t.true(correct)
})

test('getDocumentOwner(ddo) invalid ddo', (t) => {
  const ddo = Object.assign({}, getDDO(t))
  t.throws(() => util.getDocumentOwner(), TypeError)
  t.throws(() => util.getDocumentOwner('identity'), TypeError)
  ddo.authentication = []
  t.throws(() => util.getDocumentOwner(ddo), RangeError)
})

test('getDocumentOwner(ddo) valid ddo', (t) => {
  const ddo = getDDO(t)
  const owner = util.getDID(ddo)

  const docOwner = util.getDocumentOwner(ddo)
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
  t.throws(() => util.hash(t.context.identity, 'wrongEncoding'), Error)
})

test('hash(str, encoding) valid hash', (t) => {
  const { web3 } = context
  const hashed = util.hash(util.normalize(t.context.identity))
  t.true(hashed && 'string' === typeof hashed)
  t.true(web3.utils.isHex(hashed))
})

test('resolveDDO(did) invalid did', async (t) => {
  await t.throwsAsync( util.resolveDDO(), Error)
  await t.throwsAsync( util.resolveDDO(123), TypeError)
  await t.throwsAsync( util.resolveDDO('123'), Error)
  await t.throwsAsync( util.resolveDDO('123', 123), TypeError)
  await t.throwsAsync( util.resolveDDO('123', {}), Error)
})

test('resolveDDO(did) resolution', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const resolvedDDO = await util.resolveDDO(did, { secret: t.context.secret })

  t.is(ddo.publicKey[0].owner, resolvedDDO.publicKey[0].owner)
})

test('getAFSOwnerIdentity(opts) invalid opts', async (t) => {
  await t.throwsAsync( util.getAFSOwnerIdentity(), TypeError)
  await t.throwsAsync( util.getAFSOwnerIdentity({}), TypeError)
  await t.throwsAsync( util.getAFSOwnerIdentity({ did: 'did:ara:1234' }), TypeError)
})

test('getAFSOwnerIdentity(opts) correct opts', async (t) => {
  await t.notThrowsAsync(() => util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: t.context.mnemonic,
    password: t.context.password,
    secret: t.context.secret
  }))
})

test('validate(opts) invalid opts', async (t) => {
  await t.throwsAsync(util.validate(), TypeError)
  await t.throwsAsync(util.validate('opts'), TypeError)
  await t.throwsAsync(util.validate({}), Error)
  await t.throwsAsync(util.validate({
    did: '123',
    owner: 'test',
    password: t.context.password,
    secret: '10',
  }), Error)
})

test('validate(opts)', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const result = await util.validate({ did, password: t.context.password, secret: t.context.secret })
  t.true(result && 'object' === typeof result)
  t.is(result.did, did.slice(t.context.aidPrefix.length))
})

// TODO(cckelly) getDID tests
