<img src="https://github.com/AraBlocks/docs/blob/master/ara.png" width="30" height="30" /> ara-util
======================================

[![Build Status](https://travis-ci.com/AraBlocks/ara-util.svg?token=93ySMW14xn3tP6eZMEza&branch=master)](https://travis-ci.com/AraBlocks/ara-util)

Common utility functions to be used in various Ara modules.

## Status

This project is in active development.

## Stability

> [Stability][stability-index]: 2 - Stable. Compatibility with the npm ecosystem is a high priority.

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
* [async util.getAddressFromDID(did, keyringOpts)](#getaddress)
* [async util.isCorrectPassword(opts)](#isCorrectPassword)
* [async util.resolveDDO(did, \[opts\])](#resolveDDO)
* [async util.validate(opts)](#validate)
* [util.checkAFSExistence(opts)](#checkafs)
* [util.getDocumentKeyHex(ddo)](#getDocumentKeyHex)
* [util.getDocumentOwner(ddo)](#getDocumentOwner)
* [util.hash(str, \[encoding\])](#hash)
* [util.hashDID(did, \[encoding\])](#hashDID)
* [util.getIdentifier(did)](#getidentifier)

### Transform

* [util.transform.toBuffer(input, [encoding])](#toBuffer)
* [util.transform.toHexString(input, [opts])](#toHexString)

### Web3

* [async util.web3.account.load(opts)](#load)
* [async util.web3.call(opts)](#call)
* [util.web3.isAddress(address)](#isAddress)
* [util.web3.sha3(params)](#sha3)

#### Contract

* [async util.web3.contract.deploy(opts)](#deploy)
* [async util.web3.contract.estimateGas(tx, opts)](#estimateGas)
* [async util.web3.contract.get(abi, address)](#get)

#### Tx

* [async util.web3.tx.create(opts, \[signTx\])](#create)
* [async util.web3.tx.sendSignedTransaction(tx)](#sendSignedTransaction)
* [async util.web3.tx.sendTransaction(tx)](#sendTransaction)
* [util.web3.tx.estimateCost(tx, \[denomination\])](#estimateCost)
* [util.web3.tx.sign(tx, privateKey)](#sign)

#### ABI

* [util.web3.abi.encodeFunctionCall(abi, functionName, values)](#encodeFunctionCall)
* [util.web3.abi.encodeParameter(type, parameter)](#encodeParameter)
* [util.web3.abi.encodeParameters(typesArray, parameters)](#encodeParameters)

<a name="getAFSOwnerIdentity"></a>
### `async util.getAFSOwnerIdentity(opts)`

Returns the owning identity of `DID`, used for resolving the document of the identity that created an `AFS`.

- `opts`
  - `did` - `DID` of the document to resolve the owner for
  - `mnemonic` - mnemonic of the owning identity
  - `password` - password for the owner
  - `keyringOpts` - optional Keyring options

```js
const identity = await aid.create({ context, password })
const { mnemonic, did } = identity
const { did: owner } = did
const { afs } = await createAFS({ owner, password })
const resolvedOwner = await util.getAFSOwnerIdentity({ did: afs.did, mnemonic, password })
```

<a name="getaddress"></a>
### `async util.getAddressFromDID(did, keyringOpts)`

Retrieves the Ethereum address associated with a DID.

- `did` - The `DID` from which to obtain the Ethereum address
- `keyringOpts` - optional Keyring options

```js
const address = await util.getAddressFromDID(did)
```

<a name="isCorrectPassword"></a>
### `async util.isCorrectPassword(opts)`

Validates if an identity's password is correct by attempting to decrypt the Ara keystore (`keystore/ara`).

- `opts`
  - `ddo` - document to validate password for
  - `password` - password to validate against

```js
const password = 'myPass'
const isCorrect = await util.isCorrectPassword({ ddo, password })
```

<a name="validate"></a>
### `async util.validate(opts)`

Validates that a resolved document based on a `DID` can be decrypted with the `password`, proving ownership. This uses `util.isCorrectPassword` internally after resolving the document and `throws` if the password is incorrect.

- `opts`
  - `did` - `DID` of identity to validate against
  - `password` - password of the identity
  - `ddo` - optional `DDO` to use for validation (instead of resolving)
  - `keyringOpts` - optional Keyring options

Returns `object`:
  - `did` - The identifier portion of the `DID` that was passed in
  - `ddo` - The `DDO` that the `did` and `password` were authenticated against

```js
const password = 'myPass'
const did = 'did:ara:41dd7aabfa3763306d8ec69559508c0635bbc2bb591fb217905f8e9a9676a7ec'
const { did: didIdentifier, ddo } = await util.validate({ did, password })
```

<a name="checkafs"></a>
### `util.checkAFSExistence(opts)`

Checks if an AFS exists locally.

- `opts`
  - `did` - The `DID` of the AFS to check

Returns a `boolean` indicating whether the AFS exists locally.

```js
const exists = util.checkAFSExistence({ did })
```

<a name="getDocumentKeyHex"></a>
### `util.getDocumentKeyHex(ddo)`

Returns the `publicKeyHex` of the first `publicKey` entry within a document. 

- `ddo` - Document to retreive `publicKeyHex` from

```js
const publicKeyHex = util.getDocumentKeyHex(ddo) // 41dd7aabfa3763306d8ec69559508c0635bbc2bb591fb217905f8e9a9676a7ec
```

<a name="getDocumentOwner"></a>
### `util.getDocumentOwner(ddo)`

Returns the `DID` identifier of a document owner, or first entry in the `authentication` array of a `DDO`. The difference between this function and `util.getAFSOwnerIdentity` is that this function does not do any resolving.

- `ddo` - Document to retrieve owner from

```js
const owner = util.getDocumentOwner(ddo)
```

<a name="hash"></a>
### `util.hash(str, [encoding])`

`blake2b` hashes a string and returns the hashed string. An optional `encoding` can be provided, which defaults to `hex` encoding.

- `str` - `String` to hash
- `encoding` - optional `encoding` of the string

```js
const result = util.hash('Hello')
```

<a name="hashDID"></a>
### `util.hashDID(did, \[encoding\])`

`blake2b` hashes a `DID` with an optional `encoding`, which defaults to `hex`. The difference between this and `hash` is that this function takes care of normalizing the `DID` prior to hashing.

- `did` - `DID` to hash
- `encoding` - optional `encoding` of the `DID`

```js
const hash = util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
```

<a name="getidentifier"></a>
### `util.getIdentifier(did)`

Returns the identifier portion of a `DID`.

- `did` - `DID` to parse

```js
const identifier = util.getIdentifier('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e') // 14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e
```

<a name="toHexString"></a>
### `util.transform.toHexString(input, [opts])`

Prepend `0x` to a hex string for passing to Solidity contract functions.

- `input` - `String`, `Number`, or `Buffer` to be converted
- `opts`
  - `ethify` - Should the result be prepended by a `0x`
  - `encoding` - The type of encoding of the input

```js
const str = util.transform.toHexString('ef61059258414a65bf2d94a4fd3b503b5fee8b48', { encoding: 'hex', ethify: true })
// 0xef61059258414a65bf2d94a4fd3b503b5fee8b48
```

<a name="toBuffer"></a>
### `util.transform.toBuffer(input, [encoding])`

Converts a `string` to a `buffer`.

- `input` - `string` to convert
- `encoding` - Encoding of string for conversion

```js
const buf = util.web3.toBuffer('hi')
// <Buffer 68 69>
```

<a name="load"></a>
### `async util.web3.account.load(opts)`

Loads the Ethereum account associated with an Ara identity, returning the loaded [account](https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#returns) object.

- `opts`
  - `did` - `DID` to load account from
  - `password` - Identity's password

```js
const did = 'did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e'
const password = 'myPass'
const loadedAccount = await util.web3.account.load({ did, password })
```

<a name="call"></a>
### `async util.web3.call(opts)`

Makes a function call to a deployed Ethereum contract.

- `opts`
  - `abi` - `ABI` of the compiled Solidity contract to call
  - `address` - Ethereum address where contract has been deployed
  - `functionName` - Name of the function on the contract to call

Returns the result of the `call`.

```js
const { abi } = require('./build/contracts/MyContract.json')
const contractAddress = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
const result = await call({ abi, address: contractAddress, functionName: 'myContractFunction' })
```

<a name="deploy"></a>
### `async util.web3.contract.deploy(opts)`

Deploys a contract to the network of the current `Web3` provider. This returns an instance of the deployed `Contract` as well as the `gasLimit` that was used for deploying this contract.

- `opts`
  - `abi` - `ABI` of the compiled Solidity contract to deploy
  - `bytecode` - Bytecode of compiled contract
  - `account` - Ethereum account to deploy from 

```js
const { abi, bytecode } = require('./build/contracts/MyContract.json')
const account = await util.web3.account.load({ did, password })
const { contractAddress, gasLimit } = await deploy({ account, abi, bytecode })
```

<a name="estimateGas"></a>
### `async util.web3.contract.estimateGas(tx, opts)`

Estimates the gas cost of a transaction.

- `tx` - The `EthereumTx` `object` created from [util.web3.tx.create()](#create)
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

<a name="get"></a>
### `util.web3.contract.get(abi, address)`

Gets a contract instance based on its `ABI` and deployed `address`

- `abi` - `ABI` of compiled Solidity contract
- `address` - Deployed address of the contract

Returns `object`
  - `contract` - The `contract` instance
  - `ctx` - The Ara context `object`

```js
const address = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
const { contract, ctx } = util.web3.contract.get(abi, address)
ctx.close()
```

<a name="create"></a>
### `async util.web3.tx.create(opts, [signTx])`

Creates an `EthereumTx` object that can be published to the current network. Signs the transaction with the account's `privateKey` by default.

- `opts`
  - `account` - the account that will be initiating the transaction
  - `to` - the address of the contract of the transaction
  - `data` - function data to encode as part of the transaction
    - `abi` - contract ABI
    - `functionName` - name of function that's being called
    - `values` - function argument values as an array
  - `gasPrice` - optional Gas price to use for this transaction
  - `gasLimit` - optional Gas limit to use for this transaction
- `signTx` - should this transaction be signed

Returns `object`
  - `tx` - The transaction `object` created
  - `ctx` - The Ara context `object`

```js
const account = await util.web3.account.load({ did, password })
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)

const contractAddress = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
const { tx: anotherTx, ctx } = await util.web3.tx.create({
  account,
  to: contractAddress,
  data: {
    abi,
    functionName: 'setPrice',
    values: [100]
  },
  gasLimit: 100000
})
ctx.close()
```

<a name="sendSignedTransaction"></a>
### `async util.web3.tx.sendSignedTransaction(tx)`

Sends a signed transaction to the current network.

- `tx` - The signed `EthereumTx` `object` to publish to the network

Returns the transaction `receipt` `object`.

```js
const account = await util.web3.account.load({ did, password })
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const receipt = await util.web3.tx.sendSignedTransaction(signedTx)
```

<a name="sendTransaction"></a>
### `async util.web3.tx.sendTransaction(tx)`

Sends an unsigned transaction to the current network.

- `tx` - The unsigned `EthereumTx` `object` to publish to the network

Returns the transaction `receipt` `object`.

```js
const account = await util.web3.account.load({ did, password })
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
const receipt = await util.web3.tx.sendTransaction(unsignedTx)
```

<a name="estimateCost"></a>
### `util.web3.tx.estimateCost(tx, [denomination])`

Estimates the cost of a transaction. The returned value can be a particular denomination, defaults to `ether`. You can find valid denomination values [here](https://web3js.readthedocs.io/en/1.0/web3-utils.html#fromwei).

- `tx` - `EthereumTx` `object` of the transaction
- `denomination` - Unit to return the cost in

```js
const costInEth = util.web3.tx.estimateCost(tx)
const costInFinney = util.web3.tx.estimateCost(tx, 'finney')
```

<a name="sign"></a>
### `util.web3.tx.sign(tx, privateKey)`

Signs a transaction object with an account's `privateKey`.

- `tx` - `EthereumTx` `object` of the transaction
- `privateKey` - The Ethereum account's `privateKey` signing the transaction

```js
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
const { privateKey } = account
const signedTx = util.web3.tx.sign(unsignedTx, privateKey)
```

<a name="encodeFunctionCall"></a>
### `util.web3.abi.encodeFunctionCall(abi, functionName, values)`

Encodes a function call to its `ABI` signature, required for sending signed transactions that require a function on a deployed contract.

- `abi` - `ABI` of the compiled Solidity contract
- `functionName` - name of the function from the `ABI` to encode
- `values` - array of arguments for the function to encode

Returns the encoded function call as a `String`.

```js
const { abi } = require('./build/contracts/MyContract.json')
const encoded = util.web3.abi.encodeFunctionCall(abi, 'myFunctionName', ['arg1', 'arg2'])
```

<a name="encodeParameter"></a>
### `util.web3.abi.encodeParameter(type, parameter)`

Encodes a function parameter to its `ABI` signature.

- `type` - Type of parameter
- `parameter` - Value of parameter

Returns the encoded parameter as a `String`.

```js
const encoded = util.web3.abi.encodeParameter('bytes', '0xFF')
```

<a name="encodeParameters"></a>
### `util.web3.abi.encodeParameters(typesArray, parameters)`

Encodes multiple function parameters to their `ABI` signatures.

- `typesArray` - Array of types to encode
- `parameters` - Array of parameter values to encode

Returns the encoded parameters as a `String`.

```js
const encoded = util.web3.abi.encodeParameter(['bytes', 'string'], ['0xFF', 'Hello'])
```

<a name="isAddress"></a>
### `util.web3.isAddress(address)`

Validates whether a hex string is a valid Ethereum address.

- `address` - string to validate

```js
let isAddress = util.web3.isAddress('0xef61059258414a65bf2d94a4fd3b503b5fee8b48') // true
isAddress = util.web3.isAddress('Hello') // false
```

<a name="sha3"></a>
### `util.web3.sha3(params)`

`ABI` encodes and `SHA3` hashes given parameters.

- `params` - Parameters of any type or object containing parameters

```js
const result = util.web3.sha3({ param1: 1, param2: 2 })
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
