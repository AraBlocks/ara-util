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

* [util.hashDID(did, \[encoding\])](#hashDID)
* [util.normalize(did)](#normalize)
* [util.isCorrectPassword(opts)](#isCorrectPassword)
* [util.getDocumentOwner(ddo)](#getDocumentOwner)
* [util.getDocumentKeyHex(ddo)](#getDocumentKeyHex)
* [util.hash(str, \[encoding\])](#hash)
* [util.resolveDDO(did, \[opts\])](#resolveDDO)
* [util.getAFSOwnerIdentity(opts)](#getAFSOwnerIdentity)
* [util.validate(opts)](#validate)
* [util.getDID(ddo)](#getDID)

### Web3

* [util.web3.abi.encodeFunctionCall(abi, functionName, values)](#encodeFunctionCall)
* [util.web3.abi.encodeParameter(type, parameter)](#encodeParameter)
* [util.web3.abi.encodeParameters(typesArray, parameters)](#encodeParameters)
* [util.web3.account.load(opts)](#load)
* [util.web3.call(opts)](#call)
* [util.web3.contract.deploy(opts)](#deploy)
* [util.web3.contract.get(abi, address)](#get)
* [util.web3.contract.estimateGas(tx, opts)](#estimateGas)
* [util.web3.tx.create(opts, \[signTx\])](#create)
* [util.web3.tx.sign(tx, privateKey)](#sign)
* [util.web3.tx.sendTransaction(tx)](#sendTransaction)
* [util.web3.tx.sendSignedTransaction(tx)](#sendSignedTransaction)
* [util.web3.tx.estimateCost(tx, \[denomination\])](#estimateCost)

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
