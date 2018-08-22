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

> **Stability: 1** Stable

TODO

```js
const identity = await aid.create({ context, password })
const { mnemonic, did } = identity
const { did: owner } = did
const { afs } = await createAFS({ owner, password })
const resolvedOwner = await util.getAFSOwnerIdentity({ did: afs.did, mnemonic, password })
```

### `async util.isCorrectPassword(opts)` <a name="isCorrectPassword"></a>

> **Stability: 2** Stable

TODO

```js
const isCorrect = await util.isCorrectPassword({ ddo, password })
```

### `async util.resolveDDO(did, [opts])` <a name="resolveDDO"></a>

> **Stability: 1** Experimental

TODO

```js
const ddo = await util.resolveDDO(did)
```

### `async util.validate(opts)` <a name="validate"></a>

> **Stability: 1** Experimental

TODO

```js
const result = await util.validate({ did, password })
```

### `util.getDID(ddo)` <a name="getDID"></a>

> **Stability: 2** Stable

TODO

```js
const did = util.getDID(ddo)
```

### `util.getDocumentKeyHex(ddo)` <a name="getDocumentKeyHex"></a>

> **Stability: 2** Stable

TODO

```js
const publicKeyHex = util.getDocumentKeyHex(ddo)
```

### `util.getDocumentOwner(ddo)` <a name="getDocumentOwner"></a>

> **Stability: 2** Stable

TODO

```js
const owner = util.getDocumentOwner(ddo)
```

### `util.hash(str)` <a name="hash"></a>

> **Stability: 2** Stable

TODO

```js
const result = util.hash('Hello')
```

### `util.hashDID(did, \[encoding\])` <a name="hashDID"></a>

> **Stability: 2** - Stable

TODO

```js
const hash = util.hashDID('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e')
```

### `util.normalize(did)` <a name="normalize"></a>

> **Stability: 2** - Stable

TODO

```js
const normalized = util.normalize('did:ara:14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e') // 14078363f2d9aa0d269827261544e598d8bf11c66f88e49d05e85bd3d181ec8e
```

### `async util.web3.account.load(opts)` <a name="load"></a>

> **Stability: 2** - Stable

TODO

```js
const loadedAccount = await util.web3.account.load({ did, password })
```

### `async util.web3.call(opts)` <a name="call"></a>

> **Stability: 2** Stable

TODO

```js
await call({ abi, address, functionName: 'myContractFunction' })
```

### `async util.web3.contract.deploy(opts)` <a name="deploy"></a>

> **Stability: 2** - Stable

TODO

```js
const result await = deploy({ account, abi, bytecode })
```

### `async util.web3.contract.estimateGas(tx, opts)` <a name="estimateGas"></a>

> **Stability: 2** - Stable

TODO

```js
const transaction = await util.web3.tx.create({
  account,
  to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48',
  data: {
    abi,
    functionName: 'myFunctionName'
  }
})
const estimate = util.web3.contract.estimateGas(transaction)
```

### `async util.web3.tx.create(opts, [signTx])` <a name="create"></a>

> **Stability: 2** - Stable

TODO

```js
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
```

### `async util.web3.tx.sendSignedTransaction(tx)` <a name="sendSignedTransaction"></a>

> **Stability: 2** - Stable

TODO

```js
const signedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' })
const receipt = await util.web3.tx.sendSignedTransaction(signedTx)
```

### `async util.web3.tx.sendTransaction(tx)` <a name="sendTransaction"></a>

> **Stability: 2** - Stable

TODO

```js
const unsignedTx = await util.web3.tx.create({ account, to: '0xef61059258414a65bf2d94a4fd3b503b5fee8b48' }, false)
const receipt = await util.web3.tx.sendTransaction(unsignedTx)
```

### `util.web3.abi.encodeFunctionCall(abi, functionName, values)` <a name="encodeFunctionCall"></a>

> **Stability: 2** - Stable

TODO

```js
const encoded = util.web3.abi.encodeFunctionCall(abi, 'myFunctionName', ['arg1', 'arg2'])
```

### `util.web3.abi.encodeParameter(type, parameter)` <a name="encodeParameter"></a>

> **Stability: 2** - Stable

TODO

```js
const encoded = util.web3.abi.encodeParameter('bytes', '0xFF')
```

### `util.web3.abi.encodeParameters(typesArray, parameters)` <a name="encodeParameters"></a>

> ** Stability: 2** - Stable

TODO

```js
const encoded = util.web3.abi.encodeParameter(['bytes', 'string'], ['0xFF', 'Hello'])
```

### `util.web3.contract.get(abi, address)` <a name="get"></a>

> ** Stability: 2** - Stable

TODO

```js
const address = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48'
const contract = util.web3.contract.get(abi, address)
```

### `util.web3.tx.estimateCost(tx, [denomination])` <a name="estimateCost"></a>

> **Stability: 2** - Stable

TODO

```js
const costInEth = util.web3.tx.estimateCost(tx)
const costInFinney = util.web3.tx.estimateCost(tx, 'finney')
```

### `util.web3.tx.sign(tx, privateKey)` <a name="sign"></a>

> **Stability: 2** - Stable

TODO

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

## License

LGPL-3.0

[stability-index]: https://nodejs.org/api/documentation.html#documentation_stability_index
