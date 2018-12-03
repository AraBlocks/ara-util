const constants = require('./fixtures/constants')
const createContext = require('ara-context')
const aid = require('ara-identity')
const { parse } = require('path')
const sinon = require('sinon')
const test = require('ava')
const fs = require('fs')

const getDDO = t => t.context.ddo

test.before((t) => {
  t.context = Object.assign({}, constants, {
    sandbox: sinon.createSandbox(),
  })

  t.context.sandbox.stub(fs, 'readFile').callsFake((_, __, cb) => cb(null, JSON.stringify(t.context.araKeystore)))

  t.context.sandbox.stub(fs, 'lstat').callsFake((_, cb) => cb(null, { ctime: 10 }))

  t.context.sandbox.stub(aid, 'resolve').callsFake(() => t.context.ddo)

  t.context.sandbox.stub(fs, 'accessSync').callsFake((path) => {
    if ('b4dd4eedb83933b6e013971585befe56e26e4f0a875aea0938f406563e53eadb' === parse(path).base) {
      throw new Error()
    } else if ('971ffa1bd45e6ada6543d19830272ec61253adac8043b16fd99f9d5c744b44b4' === parse(path).base) {
      return true
    }
    return undefined
  })

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
  t.throws(() => util.hashDID(1234), Error)
  t.throws(() => util.hashDID(t.context.identity, 1234), TypeError)
  t.throws(() => util.hashDID(t.context.identity, 'wrongEncoding'), TypeError)
})

test('hashIdentity(did, encoding) valid identity', (t) => {
  const { web3 } = createContext({ provider: false })
  let result = util.hashDID(t.context.identity)
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))

  result = util.hashDID(t.context.identity)
  t.true('string' === typeof result)
  t.true(web3.utils.isHex(result))
})

test('getIdentifier(did) invalid did', (t) => {
  t.throws(() => util.getIdentifier(), TypeError)
  t.throws(() => util.getIdentifier(1234), TypeError)
})

test('getIdentifier(did) valid identifier', (t) => {
  let normalized = util.getIdentifier(t.context.identity)

  t.true(!normalized.includes(t.context.aidPrefix))
  t.is(normalized, t.context.identityIdentifier)
  normalized = util.getIdentifier(`${constants.kEthHexPrefix}${t.context.identityIdentifier}`)
  t.is(normalized, t.context.identityIdentifier)
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

  const docOwner = util.getDocumentOwner(ddo)

  t.truthy(docOwner)
  t.true('string' === typeof docOwner)
})

test('getDocumentKeyHex(ddo) invalid ddo', (t) => {
  t.throws(() => util.getDocumentKeyHex(), TypeError)
  t.throws(() => util.getDocumentKeyHex('did:ara:1234'), TypeError)
})

test('getDocumentKeyHex(ddo) valid ddo', (t) => {
  const ddo = getDDO(t)
  const { web3 } = createContext({ provider: false })
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
  const { web3 } = createContext({ provider: false })
  const hashed = util.hash(util.getIdentifier(t.context.identity))
  t.true(hashed && 'string' === typeof hashed)
  t.true(web3.utils.isHex(hashed))
})

test('getAFSOwnerIdentity(opts) invalid opts', async (t) => {
  await t.throwsAsync(util.getAFSOwnerIdentity(), TypeError)
  await t.throwsAsync(util.getAFSOwnerIdentity({}), TypeError)
  await t.throwsAsync(util.getAFSOwnerIdentity({ did: 'did:ara:1234' }), TypeError)
})

test('getAFSOwnerIdentity(opts) correct opts', async (t) => {
  await t.notThrowsAsync(() => util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: t.context.mnemonic,
    password: t.context.password,
    keyringOpts: {
      secret: t.context.secret
    }
  }))
})

test('validate(opts) invalid opts', async (t) => {
  await t.throwsAsync(util.validate(), TypeError)
  await t.throwsAsync(util.validate('opts'), TypeError)
  await t.throwsAsync(util.validate({}), Error)
  await t.throwsAsync(util.validate({
    did: '123',
    owner: 'test',
    password: t.context.password
  }), Error)
})

test('validate(opts)', async (t) => {
  const ddo = getDDO(t)
  const did = ddo.id
  const result = await util.validate({
    did,
    password: t.context.password,
    keyringOpts: {
      secret: t.context.secret
    }
  })
  t.true(result && 'object' === typeof result)
  t.is(result.did, did.slice(t.context.aidPrefix.length))
})

test('checkAFSExistence(opts) invalid opts', async (t) => {
  t.throws(() => util.checkAFSExistence(), Error)
  t.throws(() => util.checkAFSExistence(123), TypeError)
  t.throws(() => util.checkAFSExistence({}), Error)
})

test('checkAFSExistence(opts)', (t) => {
  t.false(util.checkAFSExistence({ did: '123' }))
  t.true(util.checkAFSExistence({ did: 'f59bce4587b0f929f49603261256313de48213954aed1446524c5ee2415a7b50' }))
})

test('getAddressFromDID(did) invalid opts', async (t) => {
  await t.throwsAsync(() => util.getAddressFromDID(), TypeError)
  await t.throwsAsync(() => util.getAddressFromDID(123), TypeError)
  await t.throwsAsync(() => util.getAddressFromDID({}), TypeError)
})

test('getAddressFromDID(did) valid opts', async (t) => {
  const address = await util.getAddressFromDID('did:ara:37c514b47dbd1122ec6f1c825bc4cf3a0d9f84f3f27e39cf077fa431b8c095b1')
  const { web3 } = createContext({ provider: false })
  t.true(null !== address && web3.utils.isAddress(address))
  t.is(address, constants.ddoAddress)
})
