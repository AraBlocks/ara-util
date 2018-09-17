const { parse } = require('did-uri')
const context = require('ara-context')()
const sinon = require('sinon')
const test = require('ava')
const aid = require('ara-identity')
const fs = require('fs')
const ss = require('ara-secret-storage')
const rc = require('../rc')()

const AID_PREFIX = 'did:ara:'

const getDDO = t => t.context.ddo

test.before(async (t) => {
  t.context = {
    sandbox: sinon.createSandbox(),
    identity: rc.network.identity.whoami,
    keyring: rc.network.identity.keyring,
    secret: 'test',
    archiverNetworkName: 'archiver',
    password: 'c',
    mnemonic: 'what a mnemonic',
    ddo: {
      '@context': 'https://w3id.org/did/v1',
      id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
      publicKey: [ {
        id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner', type: 'Ed25519VerificationKey2018', owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a', publicKeyHex: 'd93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a', publicKeyBase58: 'Fcyrsvgzvwna5ba1CLTZccfAdrqwRS6unD5LYsfy2gnM', publicKeyBase64: 'Nk7PK+ko686d0lZqzEBHkjJ6sUIceIqD9LsVlNEjCcq'
      }, {
        id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#eth', type: 'Secp256k1VerificationKey2018', owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a', publicKeyHex: '7872b4a4dbbdcbec2b89f1e8e9c1d98a6ebee30eb9cb714f4edfe5b05f08c64e6e69cf6e301dae1e82275b7074166bc755b6da3048a3cbd0d25c925a6a3abf8b', publicKeyBase58: '3QfzY6FVrYpTXfXUiH83pEFaF53K1eP1FmY9V4yJ1mFkzJpnHpCKXNTpHxQ7TvKJYLKo8fRMaLsBznF8dLC2fyES', publicKeyBase64: 'B4crSk273L7CuJ8ejpwdmKbr7jDrnLcU9O3+WwXwjGTm5pz24wHa4egidbcHQWa8dVttowSKPL0NJcklpqOr+L'
      }, {
        id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#metadata', type: 'Ed25519VerificationKey2018', owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a', publicKeyHex: '438b21df4533e5ad4e537c2a152315d384780384b93a451087d93d7fb6cb67c2', publicKeyBase58: '5YfNB78G9xaKbFQYrJF7Rr3nRPaGAD9Z23MH4DbgBx2D', publicKeyBase64: 'EOLId9FM+WtTlN8KhUjFdOEeAOEuTpFEIfZPX+2y2fC'
      } ],
      authentication: [ { publicKey: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner', type: 'Ed25519SignatureAuthentication2018' }, { publicKey: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#eth', type: 'Secp256k1SignatureAuthentication2018' }, { publicKey: 'did:ara:5b039baf6fcdc87c8fcfa24f0795861d6f09804ec4fbcfce2979c654094e9b48#owner', type: 'Ed25519VerificationKey2018' } ],
      service: [],
      created: '2018-09-13T17:52:57.237Z',
      updated: '2018-09-13T17:52:57.237Z',
      proof: {
        type: 'Ed25519VerificationKey2018', nonce: '755c7d1606e524908091bd8971d8eed88c458893c794bb30b31a65944a98761b', domain: 'ara', created: '2018-09-13T17:52:57.239Z', creator: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner', signatureValue: '9d57555557302c104638a6f1748e9c03b45e67415a72d9382c2b9b6dc01ef534ff88f4444efd88a9cbefa3be91ae6e4a65b391cf52c91977c6fa8ebc19e02902'
      }
    },
    araKeystore: {
      id: 'fcc811bb-cffa-4939-9fc7-389e5dd412ba',
      version: '0000000000000101',
      crypto: {
        cipherparams: { iv: 'f5b67cccdc096fd605a8b22096cbb46b' }, ciphertext: '22fdf3c2845b8efdbba0b82f4ac22c93b969dfee54a8fd58bfec08e592e0c369b099d69728ce212c79349737e82b163a9119790d6dc8a7ac4f38593d2cbba9f4', cipher: 'aes-128-ctr', digest: 'sha1', mac: 'fc86a30a946d5d696363f8925f834e5ef73936fd'
      }
    }
  }

  t.context.sandbox.stub(fs, 'readFile').callsFake(() => t.context.araKeystore)

  t.context.sandbox.stub(fs, 'lstat').callsFake(() => ({ ctime: 10 }))

  t.context.sandbox.stub(ss, 'decrypt').callsFake((key, opts) => {
    t.truthy(key)
    t.truthy(opts)

    t.is(opts.password, t.context.password)
    t.is(key, t.context.araKeystore)

    const header = Buffer.alloc(32)

    return Buffer.concat([ header, t.context.ddo.publicKey[0].publicKeyHex ])
  })

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

  t.true(!normalized.includes(AID_PREFIX))
})

test('isCorrectPassword(opts) invalid opts', async (t) => {
  const ddo = getDDO(t)

  await t.throwsAsync(util.isCorrectPassword, TypeError)
  await t.throwsAsync(async () => {
    await util.isCorrectPassword({})
  }, TypeError)
  await t.throwsAsync(async () => {
    await util.isCorrectPassword({ ddo })
  }, TypeError)
  await t.throwsAsync(async () => {
    await util.isCorrectPassword({ ddo, password: 123 })
  }, TypeError)
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
  await t.throwsAsync(() => util.resolveDDO(), TypeError)
  await t.throwsAsync(() => util.resolveDDO(123), TypeError)
})

test('resolveDDO(did) resolution', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const resolvedDDO = await util.resolveDDO(did)

  t.is(ddo.publicKey[0].owner, resolvedDDO.publicKey[0].owner)
})

test('getAFSOwnerIdentity(opts) invalid opts', async (t) => {
  await t.throwsAsync(() => util.getAFSOwnerIdentity(), TypeError)
  await t.throwsAsync(() => util.getAFSOwnerIdentity({}), TypeError)
  await t.throwsAsync(() => util.getAFSOwnerIdentity({ did: 'did:ara:1234' }), TypeError)
})

test('getAFSOwnerIdentity(opts) correct opts', async (t) => {
  await t.notThrowsAsync(() => util.getAFSOwnerIdentity({
    did: t.context.identity,
    mnemonic: t.context.mnemonic,
    password: t.context.password
  }))
})

test('validate(opts) invalid opts', async (t) => {
  await t.throwsAsync(() => util.validate(), TypeError)
  await t.throwsAsync(() => util.validate('opts'), TypeError)
  await t.throwsAsync(() => util.validate({ }), TypeError)
  await t.throwsAsync(() => util.validate({
    did: null,
    password: t.context.password
  }), TypeError)
})

test('validate(opts)', async (t) => {
  const ddo = getDDO(t)
  const did = util.getDID(ddo)
  const result = await util.validate({ did, password: t.context.password })
  t.true(result && 'object' === typeof result)
  t.is(result.did, did.slice(AID_PREFIX.length))
})

// TODO(cckelly) getDID tests
