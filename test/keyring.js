const { resolve } = require('path')
const sinon = require('sinon')
const test = require('ava')
const aid = require('ara-identity')
const fs = require('fs')

const { MissingParamError } = require('../errors')
const constants = require('./fixtures/constants')

let keyring
test.before((t) => {
  t.context = {
    ...constants,
    sandbox: sinon.createSandbox(),
    keyring: resolve('./test/fixtures/keyrings/keyring')
  }

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

  // eslint-disable-next-line
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

  await t.throwsAsync(
    () => keyring.getSecret(),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getSecret(123),
    { instanceOf: TypeError }
  )

  await t.throwsAsync(
    () => keyring.getSecret({}),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getSecret({ keyring: keyringPath }),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getSecret({ keyring: keyringPath, password }),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getSecret({ keyring: keyringPath, password, did }),
    { instanceOf: MissingParamError }
  )
})

test('getSecret(opts)', async (t) => {
  const secretKey = await keyring.getSecret({
    identity: t.context.identity,
    keyring: t.context.keyring,
    password: t.context.password,
    network: t.context.archiverNetworkName
  })

  t.truthy(secretKey)
})

test('getPublic(opts) invalid opts', async (t) => {
  const { keyring: keyringPath, secret } = t.context

  await t.throwsAsync(
    () => keyring.getPublic(),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getPublic(123),
    { instanceOf: TypeError }
  )

  await t.throwsAsync(
    () => keyring.getPublic({}),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getPublic({ keyring: keyringPath }),
    { instanceOf: MissingParamError }
  )

  await t.throwsAsync(
    () => keyring.getPublic({ keyring: keyringPath, secret }),
    { instanceOf: MissingParamError }
  )
})

test('getPublic(opts)', async (t) => {
  const publicKey = await keyring.getPublic({
    identity: t.context.identity,
    password: t.context.password,
    secret: t.context.secret,
    keyring: `${t.context.keyring}.pub`,
    network: t.context.archiverNetworkName
  })

  t.truthy(publicKey)
})
