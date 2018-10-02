const { MissingOptionError } = require('../errors')
const { resolve } = require('path')
const constants = require('./fixtures/constants')
const sinon = require('sinon')
const test = require('ava')
const aid = require('ara-identity')
const fs = require('fs')

let keyring
test.before((t) => {
  t.context = Object.assign({}, constants, {
    sandbox: sinon.createSandbox(),
    keyring: resolve('./test/fixtures/keyrings/keyring'),
  })

  t.context.sandbox.stub(fs, 'lstat').callsFake((_, cb) => cb(null, { ctime: 10 }))

  t.context.sandbox.stub(fs, 'readFile').callsFake((_, __, cb) => cb(null, JSON.stringify(t.context.ownerAraKeystore)))

  t.context.sandbox.stub(aid, 'resolve').callsFake(() => t.context.ownerDDO)

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

  keyring = require('../keyring')
})

test.after((t) => {
  t.context.sandbox.restore()
})

test('exists(opts)', async (t) => {
  t.true(await keyring.exists(t.context.keyring))
})

test('getSecret(opts) invalid opts', async (t) => {
  const {
    password, keyring: keyringPath, identity: did
  } = t.context

  await t.throwsAsync(keyring.getSecret(), MissingOptionError)
  await t.throwsAsync(keyring.getSecret(123), TypeError)
  await t.throwsAsync(keyring.getSecret({}), MissingOptionError)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath
  }), MissingOptionError)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath,
    password
  }), MissingOptionError)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath,
    password,
    did
  }), MissingOptionError)
})

test('getSecret(opts)', async (t) => {
  const secretKey = await keyring.getSecret({
    did: t.context.identity,
    keyring: t.context.keyring,
    password: t.context.password,
    network: t.context.archiverNetworkName
  })

  t.truthy(secretKey)
})

test('getPublic(opts) invalid opts', async (t) => {
  const { keyring: keyringPath, secret } = t.context

  await t.throwsAsync(keyring.getPublic(), MissingOptionError)
  await t.throwsAsync(keyring.getPublic(123), TypeError)
  await t.throwsAsync(keyring.getPublic({}), MissingOptionError)
  await t.throwsAsync(keyring.getPublic({
    keyring: keyringPath
  }), MissingOptionError)
  await t.throwsAsync(keyring.getPublic({
    keyring: keyringPath,
    secret
  }), MissingOptionError)
})

test('getPublic(opts)', async (t) => {
  const publicKey = await keyring.getPublic({
    secret: t.context.secret,
    keyring: `${t.context.keyring}.pub`,
    network: t.context.archiverNetworkName
  })

  t.truthy(publicKey)
})
