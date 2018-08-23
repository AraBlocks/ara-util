<img src="https://github.com/AraBlocks/docs/blob/master/ara.png" width="30" height="30" /> ara-util
======================================

[![Build Status](https://travis-ci.com/AraBlocks/ara-util.svg?token=93ySMW14xn3tP6eZMEza&branch=master)](https://travis-ci.com/AraBlocks/ara-util)

Common utility functions to be used in various Ara modules.

## Status

This project is in active development.

## Stability

> [Stability][stability-index]: 1 - Experimental. This feature is still under
> active development and subject to non-backwards compatible changes, or even
> removal, in any future version. Use of the feature is not recommended
> in production environments. Experimental features are not subject to
> the Node.js Semantic Versioning model.

## Installation

```bash
# npm install arablocks/ara-util --save
```

## Dependencies
- [Node](https://nodejs.org/en/download/)

## API

Most of the functions exported by this module will check for input
correctness. If given incorrect input, a function will throw a
`TypeError` with a message describing the error.

* [async util.getAFSOwnerIdentity(opts)](#getAFSOwnerIdentity)
* [async util.isCorrectPassword(opts)](#isCorrectPassword)
* [async util.resolveDDO(did, \[opts\])](#resolveDDO)
* [async util.validate(opts)](#validate)
* [util.getDID(ddo)](#getDID)
* [util.getDocumentKeyHex(ddo)](#getDocumentKeyHex)
* [util.getDocumentOwner(ddo)](#getDocumentOwner)
* [util.hash(str, \[encoding\])](#hash)
* [util.hashDID(did, \[encoding\])](#hashDID)
* [util.normalize(did)](#normalize)

### Web3

* [async util.web3.account.load(opts)](#load)
* [async util.web3.call(opts)](#call)
* [async util.web3.contract.deploy(opts)](#deploy)
* [async util.web3.contract.estimateGas(tx, opts)](#estimateGas)
* [async util.web3.tx.create(opts, \[signTx\])](#create)
* [async util.web3.tx.sendSignedTransaction(tx)](#sendSignedTransaction)
* [async util.web3.tx.sendTransaction(tx)](#sendTransaction)
* [util.web3.abi.encodeFunctionCall(abi, functionName, values)](#encodeFunctionCall)
* [util.web3.abi.encodeParameter(type, parameter)](#encodeParameter)
* [util.web3.abi.encodeParameters(typesArray, parameters)](#encodeParameters)
* [util.web3.contract.get(abi, address)](#get)
* [util.web3.tx.estimateCost(tx, \[denomination\])](#estimateCost)
* [util.web3.tx.sign(tx, privateKey)](#sign)

### `async util.getAFSOwnerIdentity(opts)` <a name="getAFSOwnerIdentity"></a>

> **Stability: 1** Experimental

Returns the owning identity of `DID`, used for resolving the document of the identity that created an `AFS`.

- `opts`
  - `did` - `DID` of the document to resolve the owner for
  - `mnemonic` - mnemonic of the owning identity
  - `password` - password for the owner

```js
const identity = await aid.create({ context, password })
const { mnemonic, did } = identity
const { did: owner } = did
const { afs } = await createAFS({ owner, password })
const resolvedOwner = await util.getAFSOwnerIdentity({ did: afs.did, mnemonic, password })
```

### `async util.isCorrectPassword(opts)` <a name="isCorrectPassword"></a>

> **Stability: 2** Stable

Validates if an identity's password is correct by attempting to decrypt the Ara keystore (`keystore/ara`).

- `opts`
  - `ddo` - document to validate password for
  - `password` - password to validate against

```js
const password = 'myPass'
const isCorrect = await util.isCorrectPassword({ ddo, password })
```

### `async util.resolveDDO(did, [opts])` <a name="resolveDDO"></a>

> **Stability: 1** Experimental

Resolves an identity document based on a `DID`. Both normalized and non-normalized `DID`s are accepted. 

- `did` - `DID` of the document to resolve
- `opts`
  - `name` - name of `keyring` to use
  - `secret` - `keyring` secret to use
  - `keyring` - path to `keyring`
  
If `opts` are not provided, defaults with respect to network keys will be used.

```js
const myDID = 'did:ara:41dd7aabfa3763306d8ec69559508c0635bbc2bb591fb217905f8e9a9676a7ec'
const ddo = await util.resolveDDO(myDID)
```

### `async util.validate(opts)` <a name="validate"></a>

> **Stability: 1** Experimental

Validates that a resolved document based on a `DID` can be decrypted with the `password`, proving ownership. This used `util.isCorrectPassword` internally after resolving the document.

- `opts`
  - `did` - `DID` of identity to validate against
  - `owner` - owner `DID` of identity to validate against
  - `password` - password of the identity

Either `did` or `owner` should be provided, but not both.

```js
const password = 'myPass'
const did = 'did:ara:41dd7aabfa3763306d8ec69559508c0635bbc2bb591fb217905f8e9a9676a7ec'
const result = await util.validate({ did, password })
```

### `util.getDID(ddo)` <a name="getDID"></a>

> **Stability: 2** Stable

Returns the `DID` within a `DDO`.

- `ddo` - document to retrieve the `DID` from

```js
const did = util.getDID(ddo)
```

### `util.getDocumentKeyHex(ddo)` <a name="getDocumentKeyHex"></a>

> **Stability: 2** Stable

Returns the `publicKeyHex` of the first `publicKey` entry within a document. 

- `ddo` - document to retreive `publicKeyHex` from

```js
const publicKeyHex = util.getDocumentKeyHex(ddo) // 41dd7aabfa3763306d8ec69559508c0635bbc2bb591fb217905f8e9a9676a7ec
```

### `util.getDocumentOwner(ddo)` <a name="getDocumentOwner"></a>

> **Stability: 2** Stable

Returns the normalized `DID` of a document owner, or first entry in the `authentication` array of a `DDO`. The difference between this function and `util.getAFSOwnerIdentity` is that this function does not do any resolving.

- `ddo` - document to retrieve owner from

```js
const owner = util.getDocumentOwner(ddo)
```

### `util.hash(str, [encoding])` <a name="hash"></a>

> **Stability: 2** Stable

`blake2b` hashes a string and returns the hashed string. An optional `encoding` can be provided, which defaults to `hex` encoding.

- `str` - string to hash
- `encoding` - optional `encoding` of the string

```js
const result = util.hash('Hello')
```

### `util.hashDID(did, \[encoding\])` <a name="hashDID"></a>

> **Stability: 2** - Stable

`blake2b` hashes a `DID` with an optional `encoding`, which defaults to `hex`. The difference between this and `hash` is that this function takes care of normalizing the `DID` prior to hashing.

- `did` - `DID` to hash
- `encoding` - optional `encoding` of the `DID`

```js
const hash = util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
```

### `util.normalize(did)` <a name="normalize"></a>

> **Stability: 2** - Stable

Normalizes a `DID` by removing the method.

- `did` - `DID` to normalize

```js
const normalized = util.normalize('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e') // 14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e
```

### `async util.web3.account.load(opts)` <a name="load"></a>

> **Stability: 2** - Stable

Loads the Ethereum account associated with an Ara identity, returning the loaded [account](https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#returns) object.

- `opts`
  - `did` - `DID` to load account from
  - `password` - identity's password

```js
const did = 'did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e'
const password = 'myPass'
const loadedAccount = await util.web3.account.load({ did, password })
```

### `async util.web3.call(opts)` <a name="call"></a>

> **Stability: 2** Stable

Makes a function call to a deployed Ethereum contract.

- `abi` - `ABI` of the compiled Solidity contract to call
- `address` - Ethereum address where contract has been deployed
- `functionName` - name of the function on the contract to call

```js
const { abi } = require('./build/contracts/MyContract.json')
const contractAddress = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
await call({ abi, address: contractAddress, functionName: 'myContractFunction' })
```

### `async util.web3.contract.deploy(opts)` <a name="deploy"></a>

> **Stability: 2** - Stable

Deploys a contract to the network of the current `Web3` provider.

- `abi` - `ABI` of the compiled Solidity contract to deploy
- `bytecode` - bytecode of compiled contract
- `account` - Ethereum account to deploy from 

```js
const { abi, bytecode } = require('./build/contracts/MyContract.json')
const account = await util.web3.account.load({ did, password })
const result = await deploy({ account, abi, bytecode })
```

### `async util.web3.contract.estimateGas(tx, opts)` <a name="estimateGas"></a>

> **Stability: 2** - Stable

Estimates the gas cost of a transaction.

- `tx` - The `EthereumTx` object created from [util.web3.tx.create()](#create)
- `opts` - [contract options](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#web3-eth-contract)

```js
const transaction = await util.web3.tx.create({
  account,
  to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48',
  data: {
    abi,
    functionName: 'setNumbers',
    values: [1, 2, 3]
  }
})
const estimate = util.web3.contract.estimateGas(tx, opts)
```

### `async util.web3.tx.create(opts, [signTx])` <a name="create"></a>

> **Stability: 2** - Stable

Creates an `EthereumTx` object that can be published to the current network. Signs the transaction with the account's `privateKey` by default.

- `opts`
  - `account` - the account that will be initiating the transaction
  - `to` - the address of the contract of the transaction
- `signTx` - should this transaction be signed

```js
const account = await util.web3.account.load({ did, password })
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
```

### `async util.web3.tx.sendSignedTransaction(tx)` <a name="sendSignedTransaction"></a>

> **Stability: 2** - Stable

Sends a signed transaction to the current network.

- `tx` - The signed `EthereumTx` object to publish to the network

```js
const account = await util.web3.account.load({ did, password })
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const receipt = await util.web3.tx.sendSignedTransaction(signedTx)
```

### `async util.web3.tx.sendTransaction(tx)` <a name="sendTransaction"></a>

> **Stability: 2** - Stable

Sends an unsigned transaction to the current network.

- `tx` - The unsigned `EthereumTx` object to publish to the network

```js
const account = await util.web3.account.load({ did, password })
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
const receipt = await util.web3.tx.sendTransaction(unsignedTx)
```

### `util.web3.abi.encodeFunctionCall(abi, functionName, values)` <a name="encodeFunctionCall"></a>

> **Stability: 2** - Stable

Encodes a function call to its `ABI` signature, required for sending signed transactions that require a function on a deployed contract.

- `abi` - `ABI` of the compiled Solidity contract
- `functionName` - name of the function from the `ABI` to encode
- `values` - array of arguments for the function to encode

```js
const { abi } = require('./build/contracts/MyContract.json')
const encoded = util.web3.abi.encodeFunctionCall(abi, 'myFunctionName', ['arg1', 'arg2'])
```

### `util.web3.abi.encodeParameter(type, parameter)` <a name="encodeParameter"></a>

> **Stability: 2** - Stable

Encodes a function parameter to its `ABI` signature.

- `type` - type of parameter
- `parameter` - value of parameter

```js
const encoded = util.web3.abi.encodeParameter('bytes', '0xFF')
```

### `util.web3.abi.encodeParameters(typesArray, parameters)` <a name="encodeParameters"></a>

> ** Stability: 2** - Stable

Encodes multiple function parameters to their `ABI` signatures.

- `typesArray` - array of types to encode
- `parameters` - array of parameters to encode

```js
const encoded = util.web3.abi.encodeParameter(['bytes', 'string'], ['0xFF', 'Hello'])
```

### `util.web3.contract.get(abi, address)` <a name="get"></a>

> ** Stability: 2** - Stable

Gets a contract instance based on its `ABI` and deployed `address`

- `abi` - `ABI` of compiled Solidity contract
- `address` - deployed address of the contract

```js
const address = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
const contract = util.web3.contract.get(abi, address)
```

### `util.web3.tx.estimateCost(tx, [denomination])` <a name="estimateCost"></a>

> **Stability: 2** - Stable

Estimates the cost of a transaction. The returned value can be a particular denomination, defaults to `ether`.

- `tx` - `EthereumTx` object of the transaction
- `denomination` - unit to return the cost in

```js
const costInEth = util.web3.tx.estimateCost(tx)
const costInFinney = util.web3.tx.estimateCost(tx, 'finney')
```

### `util.web3.tx.sign(tx, privateKey)` <a name="sign"></a>

> **Stability: 2** - Stable

Signs a transaction object with an account's `privateKey`.

- `tx` - `EthereumTx` object of the transaction
- `privateKey` - the Ethereum account's `privateKey` signing the transaction

```js
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
const { privateKey } = account
const signedTx = util.web3.tx.sign(unsignedTx, privateKey)
```

## Contributing

- [Commit message format](/.github/COMMIT_FORMAT.md)
- [Commit message examples](/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](/.github/CONTRIBUTING.md)

## See Also

- [ara-filesystem](https://github.com/arablocks/ara-filesystem)
- [ara-identity](https://github.com/arablocks/ara-identity)
- [ara-crypto](https://github.com/arablocks/ara-crypto)
- [ara-secret-storage](https://github.com/arablocks/ara-secret-storage)
- [Web3](https://github.com/ethereum/web3.js)
- [Stability index][stability-index]

## License

LGPL-3.0

[stability-index]: https://nodejs.org/api/documentation.html#documentation_stability_index
