## [1.2.1](https://github.com/arablocks/ara-util/compare/0.6.2...1.2.1) (2018-12-17)


### Bug Fixes

* **.npmignore:** add build/ to npmignore ([a2a856d](https://github.com/arablocks/ara-util/commit/a2a856d))
* **keyring.js:** Cast secret to Buffer in getPublic, fix tests ([0955a87](https://github.com/arablocks/ara-util/commit/0955a87))
* travis ([159be1c](https://github.com/arablocks/ara-util/commit/159be1c))
* **tx.js:** added ctx.close() before typeErrors in create ([0d0b66c](https://github.com/arablocks/ara-util/commit/0d0b66c))
* **tx.js:** closes ctx if err during sendSignedTransaction ([b957133](https://github.com/arablocks/ara-util/commit/b957133))
* **web3/contract.js:** oops ([b5ca67b](https://github.com/arablocks/ara-util/commit/b5ca67b))
* all tests passing ([05d38a4](https://github.com/arablocks/ara-util/commit/05d38a4))
* **web3/contract.js:** sign contract deployments ([a7fe661](https://github.com/arablocks/ara-util/commit/a7fe661))
* [#70](https://github.com/arablocks/ara-util/issues/70) ([7e5300f](https://github.com/arablocks/ara-util/commit/7e5300f))
* add lint disables for build folder require statements ([202450d](https://github.com/arablocks/ara-util/commit/202450d))
* index.js tests ([16a3b1a](https://github.com/arablocks/ara-util/commit/16a3b1a))
* lint ([c3fc548](https://github.com/arablocks/ara-util/commit/c3fc548))
* lint ([b31a80b](https://github.com/arablocks/ara-util/commit/b31a80b))
* lint ([d3744aa](https://github.com/arablocks/ara-util/commit/d3744aa))
* lint ([f75dd79](https://github.com/arablocks/ara-util/commit/f75dd79))
* PR comment ([1509497](https://github.com/arablocks/ara-util/commit/1509497))
* tests ([97e09a1](https://github.com/arablocks/ara-util/commit/97e09a1))
* throws -> throwsAsync ([e9bf535](https://github.com/arablocks/ara-util/commit/e9bf535))
* update context usage ([d245400](https://github.com/arablocks/ara-util/commit/d245400))
* update context usage and change normalize tests to getIdentifier ([f6d451e](https://github.com/arablocks/ara-util/commit/f6d451e))
* **web3/tx:** Remove passing obj into new Error ([8ab072c](https://github.com/arablocks/ara-util/commit/8ab072c))


### Features

* add context getter ([9c83562](https://github.com/arablocks/ara-util/commit/9c83562))
* add option for raw sha3 ([29ead17](https://github.com/arablocks/ara-util/commit/29ead17))



## [0.6.2](https://github.com/arablocks/ara-util/compare/0.5.2...0.6.2) (2018-11-08)


### Bug Fixes

* remove unncessary owner in validate ([be907f5](https://github.com/arablocks/ara-util/commit/be907f5))


### Features

* **web3/tx.js:** custom gasPrice in tx.create ([90e2c9f](https://github.com/arablocks/ara-util/commit/90e2c9f))



## [0.5.2](https://github.com/arablocks/ara-util/compare/0.5.1...0.5.2) (2018-10-31)


### Bug Fixes

* **index:** normalize did before extract identifier ([0d64882](https://github.com/arablocks/ara-util/commit/0d64882))



## [0.5.1](https://github.com/arablocks/ara-util/compare/0.5.0...0.5.1) (2018-10-30)



# [0.5.0](https://github.com/arablocks/ara-util/compare/0.4.0...0.5.0) (2018-10-29)


### Bug Fixes

* **keyring:** Define dervice correctly ([5b65a24](https://github.com/arablocks/ara-util/commit/5b65a24))
* **keyring:** Pass back correct public and private keys ([3a7e25c](https://github.com/arablocks/ara-util/commit/3a7e25c))
* **keyring:** Return public and secretKey from getPublic ([64dc3d2](https://github.com/arablocks/ara-util/commit/64dc3d2))
* **scripts/test:** chmod 755 script ([528fea7](https://github.com/arablocks/ara-util/commit/528fea7))


### Features

* **keyring:** Catch common errors in getPublic,getSecret ([86c7744](https://github.com/arablocks/ara-util/commit/86c7744))



# [0.4.0](https://github.com/arablocks/ara-util/compare/0.3.4...0.4.0) (2018-10-19)


### Bug Fixes

* remove rc.js and keyring.js ([d36094d](https://github.com/arablocks/ara-util/commit/d36094d))
* **index:** Fix issue with not detecting AFS w no content ([a0333ce](https://github.com/arablocks/ara-util/commit/a0333ce))
* **transform:** Change toHex calls to toHexBuffer ([8ac9f5d](https://github.com/arablocks/ara-util/commit/8ac9f5d))


### Features

* **index:** Add checkAFSExistance function ([85a18ec](https://github.com/arablocks/ara-util/commit/85a18ec))
* **web3:** Add deprecation warnings for transform funcs ([8333312](https://github.com/arablocks/ara-util/commit/8333312))



## [0.3.4](https://github.com/arablocks/ara-util/compare/0.3.3...0.3.4) (2018-10-11)


### Bug Fixes

* get correct doc owner ([b017093](https://github.com/arablocks/ara-util/commit/b017093))
* **index.validate:** Add back ddo opt ([81e5fcc](https://github.com/arablocks/ara-util/commit/81e5fcc))
* update secret to keyrings ([835e8f6](https://github.com/arablocks/ara-util/commit/835e8f6))
* **errors, test:** Fix error export, fix tests ([67526a3](https://github.com/arablocks/ara-util/commit/67526a3))
* **index:** destructure and default keyringOpts in getAFSownerid ([5019160](https://github.com/arablocks/ara-util/commit/5019160))
* **index:** pass non-null object to resolve ([3521731](https://github.com/arablocks/ara-util/commit/3521731))
* **index:** type check of keyringOpts ([cdfd402](https://github.com/arablocks/ara-util/commit/cdfd402))
* **index.resolveDDO:** Fix issue with reference to non-existent property ([acccb1b](https://github.com/arablocks/ara-util/commit/acccb1b))
* **index.resolveDDO:** Fix issue with reference to non-existent property ([00f83f1](https://github.com/arablocks/ara-util/commit/00f83f1))
* **keyring:** Fix issues raised by tests ([166e69c](https://github.com/arablocks/ara-util/commit/166e69c))
* **package.json:** revert to stable ara-identity ([e7ed073](https://github.com/arablocks/ara-util/commit/e7ed073))


### Features

* Add MissingOptionError ([7b3e8b4](https://github.com/arablocks/ara-util/commit/7b3e8b4))
* get eth address from did ([7db293f](https://github.com/arablocks/ara-util/commit/7db293f))
* support pass in ddo to validate ([f0885d4](https://github.com/arablocks/ara-util/commit/f0885d4))
* **errors:** Allow MissingOptionError.expectedKey to be array ([98b68fc](https://github.com/arablocks/ara-util/commit/98b68fc))
* **errors,keyring:** Add keyring funcs, add Ara errs ([41cdfa8](https://github.com/arablocks/ara-util/commit/41cdfa8))
* **index:** added keyring opts to validate and getAFSOwnerIdentity ([42e2568](https://github.com/arablocks/ara-util/commit/42e2568))



## [0.3.3](https://github.com/arablocks/ara-util/compare/0.3.2...0.3.3) (2018-08-27)


### Bug Fixes

* need await :( ([55c3dc0](https://github.com/arablocks/ara-util/commit/55c3dc0))



## [0.3.2](https://github.com/arablocks/ara-util/compare/0.3.1...0.3.2) (2018-08-27)


### Bug Fixes

* scope ([157b4d7](https://github.com/arablocks/ara-util/commit/157b4d7))



## [0.3.1](https://github.com/arablocks/ara-util/compare/0.3.0...0.3.1) (2018-08-27)


### Features

* **web3/contract.js:** return gasLimit from contract deploy ([dddcede](https://github.com/arablocks/ara-util/commit/dddcede))



# [0.3.0](https://github.com/arablocks/ara-util/compare/0.2.0...0.3.0) (2018-08-24)


### Bug Fixes

* **index.js:** update getDocumentOwner to use publicKey ([8e24fdd](https://github.com/arablocks/ara-util/commit/8e24fdd))


### Features

* move ara-contracts util functions ([3dc3f53](https://github.com/arablocks/ara-util/commit/3dc3f53))



# [0.2.0](https://github.com/arablocks/ara-util/compare/120e9ab...0.2.0) (2018-08-24)


### Bug Fixes

* cleanup error messages, start resolve migrate, secret-storage ([0ecdba6](https://github.com/arablocks/ara-util/commit/0ecdba6))
* cleanup error messages, start resolve migrate, secret-storage ([b98ecb7](https://github.com/arablocks/ara-util/commit/b98ecb7))
* **index.js:** remove old log ([7facb3b](https://github.com/arablocks/ara-util/commit/7facb3b))
* **index.js:** remove pw requirement for validate ([88c2a47](https://github.com/arablocks/ara-util/commit/88c2a47))
* **web3/abi.js:** remove string conversion for function params ([08f506b](https://github.com/arablocks/ara-util/commit/08f506b))


### Features

* allow for configurable resolve opts, fix gitignore typo ([6537efa](https://github.com/arablocks/ara-util/commit/6537efa))
* first pass, migrate ara-web3 into ara-util/web3 ([e48bb6d](https://github.com/arablocks/ara-util/commit/e48bb6d))
* utility methods around did and ddos ([120e9ab](https://github.com/arablocks/ara-util/commit/120e9ab))
* **.npmrc:** npmrc file ([14096db](https://github.com/arablocks/ara-util/commit/14096db))
* **index.js:** fleshed out rest of utility functions ([b0530ac](https://github.com/arablocks/ara-util/commit/b0530ac))



