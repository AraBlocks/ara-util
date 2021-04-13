const { writeIdentity } = require('ara-identity/util')
const { create } = require('ara-identity')
const test = require('ava')

const account = require('../../web3/account')

const {
  kPassword,
  kPrefix,
  getDID,
  getAccount
} = require('./_util')

test.before(async (t) => {
  const identity = await create({ password: kPassword })
  await writeIdentity(identity)
  t.context = {
    account: identity.account,
    did: identity.did
  }
})

test('load(opts) invalid opts', async (t) => {
  const did = getDID(t)
  await t.throwsAsync(
    () => account.load(),
    { instanceOf: TypeError },
    'Expecting opts object'
  )

  // did validation
  await t.throwsAsync(
    () => account.load({ did: 123 }),
    { instanceOf: TypeError },
    'Expecting DID URI to be non-empty string'
  )

  const withoutPrefix = did.replace(kPrefix, '')
  await t.throwsAsync(
    () => account.load({ did: withoutPrefix, password: kPassword }),
    { instanceOf: Error },
    'Invalid DID protocol'
  )

  // password validation
  await t.throwsAsync(
    () => account.load({ did, password: 123 }),
    { instanceOf: TypeError },
    'Expecting password to be non-empty string'
  )
})

test('load(opts) incorrect password', async (t) => {
  const did = getDID(t)
  await t.notThrowsAsync(() => account.load({ did, password: kPassword }))
  await t.throwsAsync(
    () => account.load({ did, password: 'wrongPass' }),
    { instanceOf: Error },
    'Incorrect password'
  )
})

test('load(opts) valid opts', async (t) => {
  const did = getDID(t)
  const initialAccount = getAccount(t)
  const loadedAccount = await account.load({ did, password: kPassword })

  t.true('object' === typeof loadedAccount)
  t.is(initialAccount.address, loadedAccount.address)
  t.is(initialAccount.privateKey, loadedAccount.privateKey)
})
