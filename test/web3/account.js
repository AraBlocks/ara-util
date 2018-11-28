const test = require('ava')
const { create } = require('ara-identity')
const { writeIdentity } = require('ara-identity/util')
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
  await t.throwsAsync(account.load(), TypeError, 'Expecting opts object')

  // did validation
  await t.throwsAsync(account.load({ did: 123 }), TypeError, 'Expecting DID URI to be non-empty string')
  const withoutPrefix = did.replace(kPrefix, '')
  await t.throwsAsync(account.load({ did: withoutPrefix, password: kPassword }), Error, 'Invalid DID protocol')

  // password validation
  await t.throwsAsync(account.load({ did, password: 123 }), TypeError, 'Expecting password to be non-empty string')
})

test('load(opts) incorrect password', async (t) => {
  const did = getDID(t)
  await t.throwsAsync(account.load({ did, password: 'wrongPass' }), Error, 'Incorrect password')
  await t.notThrowsAsync(account.load({ did, password: kPassword }))
})

test('load(opts) valid opts', async (t) => {
  const did = getDID(t)
  const initialAccount = getAccount(t)
  const loadedAccount = await account.load({ did, password: kPassword })

  t.true('object' === typeof loadedAccount)
  t.is(initialAccount.address, loadedAccount.address)
  t.is(initialAccount.privateKey, loadedAccount.privateKey)
})
