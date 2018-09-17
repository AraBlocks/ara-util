const { resolve } = require('path')
const constants = require('./fixtures/constants')
const sinon = require('sinon')
const test = require('ava')
const aid = require('ara-identity')
const fs = require('fs')
const rc = require('../rc')()

test.before((t) => {
  t.context = Object.assign({}, constants, {
    sandbox: sinon.createSandbox(),
    identity: rc.network.identity.whoami,
    keyring: resolve('./test/fixtures/keyrings/keyring'),
  })

  t.context.sandbox.stub(fs, 'lstat').callsFake(() => ({ ctime: 10 }))

  t.context.sandbox.stub(fs, 'readFile').callsFake(() => t.context.araKeystore)

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

const keyring = require('../keyring')

test('exists(opts)', async (t) => {
  t.true(await keyring.exists(t.context.keyring))
})

test('getSecret(opts) invalid opts', async (t) => {
  const {
    password, keyring: keyringPath, identity: did
  } = t.context

  await t.throwsAsync(keyring.getSecret(), Error)
  await t.throwsAsync(keyring.getSecret({}), Error)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath
  }), Error)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath,
    password
  }), Error)
  await t.throwsAsync(keyring.getSecret({
    keyring: keyringPath,
    password,
    did
  }), Error)
})

test('getSecret(opts)', async (t) => {
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
  const { keyring: keyringPath, secret } = t.context

  await t.throwsAsync(keyring.getPublic(), Error)
  await t.throwsAsync(keyring.getPublic({}), Error)
  await t.throwsAsync(keyring.getPublic({
    keyring: keyringPath
  }), Error)
  await t.throwsAsync(keyring.getPublic({
    keyring: keyringPath,
    secret
  }), Error)
})

test('getPublic(opts)', async (t) => {
  const publicKey = await keyring.getPublic({
    secret: t.context.secret,
    keyring: `${t.context.keyring}.pub`,
    network: t.context.archiverNetworkName
  })

  t.truthy(publicKey)
})
