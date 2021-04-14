## [2.0.2](https://github.com/arablocks/ara-util/compare/2.0.1...2.0.2) (2021-04-14)



## [2.0.1](https://github.com/arablocks/ara-util/compare/2.0.0...2.0.1) (2021-04-13)



# [2.0.0](https://github.com/arablocks/ara-util/compare/0.6.2...2.0.0) (2021-04-13)


### Bug Fixes

* add catch to promievent ([d921b1d](https://github.com/arablocks/ara-util/commit/d921b1d80bbea7ad5c88432148df1a31d44bb6b1))
* check if gasPrice was passed in ([746a813](https://github.com/arablocks/ara-util/commit/746a81392bfd736baf0be7b7943e543b6c73d521))
* convert gwei input to wei ([9544af3](https://github.com/arablocks/ara-util/commit/9544af3fcf11e4922361467d2d987eee1d28351b))
* lint ([9c169e2](https://github.com/arablocks/ara-util/commit/9c169e2828acc8e56b70701bd017cb055ee0a3a2))
* **.npmignore:** add build/ to npmignore ([a2a856d](https://github.com/arablocks/ara-util/commit/a2a856d7a4098bd054c04ac977e133db991797b3))
* **tx.js:** added ctx.close() before typeErrors in create ([abe6856](https://github.com/arablocks/ara-util/commit/abe6856509ddaa5d0f945d843d58804d96996a27))
* **tx.js:** closes ctx if err during sendSignedTransaction ([a36b1aa](https://github.com/arablocks/ara-util/commit/a36b1aa44289745b45bc505011b30047d350aa65))
* [#70](https://github.com/arablocks/ara-util/issues/70) ([7e5300f](https://github.com/arablocks/ara-util/commit/7e5300fcfce6601adc61f137b3800bccb9c34277))
* add lint disables for build folder require statements ([202450d](https://github.com/arablocks/ara-util/commit/202450d6053b183b9afba44d53ff6fb59f4f3d25))
* all tests passing ([05d38a4](https://github.com/arablocks/ara-util/commit/05d38a4f7f620dad04e68af5135c70ba76e1a81e))
* index.js tests ([16a3b1a](https://github.com/arablocks/ara-util/commit/16a3b1a31735d8bcc2757f9fc9330119933537a3))
* lint ([b31a80b](https://github.com/arablocks/ara-util/commit/b31a80baab259617f6384cae646dcef49ebd93be))
* lint ([c3fc548](https://github.com/arablocks/ara-util/commit/c3fc548884c4202dc38db51afa228dd83bcc8571))
* lint ([d3744aa](https://github.com/arablocks/ara-util/commit/d3744aae413f0f1badae63c628019097d81fcc46))
* lint ([f75dd79](https://github.com/arablocks/ara-util/commit/f75dd798de5fce3155b4fc9e0c2fb99fa374b9db))
* PR comment ([1509497](https://github.com/arablocks/ara-util/commit/1509497f4e8c0a3f1987914e55226c0392cdf711))
* tests ([97e09a1](https://github.com/arablocks/ara-util/commit/97e09a1bdda13a7f1361d6b0845ab980ea5ff743))
* throws -> throwsAsync ([e9bf535](https://github.com/arablocks/ara-util/commit/e9bf5354ca431ef90cf0870559545751876af507))
* travis ([159be1c](https://github.com/arablocks/ara-util/commit/159be1c26af0ea9c0298bf58666691afd3a3ac6a))
* update context usage ([d245400](https://github.com/arablocks/ara-util/commit/d2454006eac77d59ee9953b208b5e014f60b54f2))
* update context usage and change normalize tests to getIdentifier ([f6d451e](https://github.com/arablocks/ara-util/commit/f6d451e982cbb3316f62dbc1e7993683035b4659))
* **keyring.js:** Cast secret to Buffer in getPublic, fix tests ([0955a87](https://github.com/arablocks/ara-util/commit/0955a87853a76ac3e11b670eb29535f180e330d7))
* **web3/contract.js:** oops ([b5ca67b](https://github.com/arablocks/ara-util/commit/b5ca67ba06e953010fcd798112ee1941b6cc79a4))
* **web3/contract.js:** sign contract deployments ([a7fe661](https://github.com/arablocks/ara-util/commit/a7fe661647c15eae08e901f318055a178c3b6007))
* **web3/tx:** Remove passing obj into new Error ([8ab072c](https://github.com/arablocks/ara-util/commit/8ab072c9cdb4848e46137eeaa7e3e3fc318a8f05))


### Features

* add context getter ([9c83562](https://github.com/arablocks/ara-util/commit/9c8356295dc3b0ebbc2f485e5de9cfe177baa1f0))
* add getTransactionReceipt ([7256442](https://github.com/arablocks/ara-util/commit/7256442344354bc583106d76c49e2e777bd6bed0))
* add option for raw sha3 ([29ead17](https://github.com/arablocks/ara-util/commit/29ead1726539c48bc84c2e480d3935c97be13a0b))
* support in contract ([2060335](https://github.com/arablocks/ara-util/commit/2060335df987751f01536fbbbd5dfd1e4f5c88a4))
* support transaction callbacks ([7a8d366](https://github.com/arablocks/ara-util/commit/7a8d366a51ac6a808d0b47d70693160f1a914b8d))



## [0.6.2](https://github.com/arablocks/ara-util/compare/0.5.2...0.6.2) (2018-11-08)


### Bug Fixes

* remove unncessary owner in validate ([be907f5](https://github.com/arablocks/ara-util/commit/be907f5b43415053468023f6ad77e58bdf89a94b))


### Features

* **web3/tx.js:** custom gasPrice in tx.create ([90e2c9f](https://github.com/arablocks/ara-util/commit/90e2c9f5d5befa484f65f4b77f4c3847632b2f10))



## [0.5.2](https://github.com/arablocks/ara-util/compare/0.5.1...0.5.2) (2018-10-31)


### Bug Fixes

* **index:** normalize did before extract identifier ([0d64882](https://github.com/arablocks/ara-util/commit/0d64882e2b6fed64f1586e899ebf6961bdf822cd))



## [0.5.1](https://github.com/arablocks/ara-util/compare/0.5.0...0.5.1) (2018-10-30)



# [0.5.0](https://github.com/arablocks/ara-util/compare/0.4.0...0.5.0) (2018-10-29)


### Bug Fixes

* **keyring:** Define dervice correctly ([5b65a24](https://github.com/arablocks/ara-util/commit/5b65a24f4c951ae8da70449d31e86074bdc72ece))
* **keyring:** Pass back correct public and private keys ([3a7e25c](https://github.com/arablocks/ara-util/commit/3a7e25c37e20937c1b382303f7ab422790667487))
* **keyring:** Return public and secretKey from getPublic ([64dc3d2](https://github.com/arablocks/ara-util/commit/64dc3d2352b10c3565cccae20ac12cbece0fa424))
* **scripts/test:** chmod 755 script ([528fea7](https://github.com/arablocks/ara-util/commit/528fea70433366cd2b0d02db0316b68192eb8a2b))


### Features

* **keyring:** Catch common errors in getPublic,getSecret ([86c7744](https://github.com/arablocks/ara-util/commit/86c77440deee42b4bebb1dc4bdcb4ef86393c900))



# [0.4.0](https://github.com/arablocks/ara-util/compare/0.3.4...0.4.0) (2018-10-19)


### Bug Fixes

* **index:** Fix issue with not detecting AFS w no content ([a0333ce](https://github.com/arablocks/ara-util/commit/a0333ce2c94519ff98935049c5fb510e9a896303))
* **transform:** Change toHex calls to toHexBuffer ([8ac9f5d](https://github.com/arablocks/ara-util/commit/8ac9f5d234e5ccbf7ddc55cbe7570f9061bd4871))
* remove rc.js and keyring.js ([d36094d](https://github.com/arablocks/ara-util/commit/d36094d7b18cb0a8f514f4b81ad7a9ce4f5d4fa9))


### Features

* **index:** Add checkAFSExistance function ([85a18ec](https://github.com/arablocks/ara-util/commit/85a18ecd6f14f651f040a47619028700535f6386))
* **web3:** Add deprecation warnings for transform funcs ([8333312](https://github.com/arablocks/ara-util/commit/8333312205252f30ea382f7e47c05851342fac23))



## [0.3.4](https://github.com/arablocks/ara-util/compare/0.3.3...0.3.4) (2018-10-11)


### Bug Fixes

* **errors, test:** Fix error export, fix tests ([67526a3](https://github.com/arablocks/ara-util/commit/67526a33c2dda7d5c314e80341b8f4287cf1b025))
* **index:** destructure and default keyringOpts in getAFSownerid ([5019160](https://github.com/arablocks/ara-util/commit/50191605133122570c5459e1caf2d4200a040021))
* **index:** pass non-null object to resolve ([3521731](https://github.com/arablocks/ara-util/commit/352173125b1a1c41bc2cb4b6996f660ebb48b8c0))
* **index:** type check of keyringOpts ([cdfd402](https://github.com/arablocks/ara-util/commit/cdfd402d0feaccb57ab85d6906ff7a05db5a771b))
* **index.resolveDDO:** Fix issue with reference to non-existent property ([00f83f1](https://github.com/arablocks/ara-util/commit/00f83f1f9763880dde5047db947f8e6713caadf5))
* **index.resolveDDO:** Fix issue with reference to non-existent property ([acccb1b](https://github.com/arablocks/ara-util/commit/acccb1bd8a8276d534c9ce91d4ec880ecaadb1b3))
* **index.validate:** Add back ddo opt ([81e5fcc](https://github.com/arablocks/ara-util/commit/81e5fcc88bc89c018f0f45c9459eeac217d1bce6))
* **keyring:** Fix issues raised by tests ([166e69c](https://github.com/arablocks/ara-util/commit/166e69c2f79dd62464cb801a05e822ca90bfd04e))
* **package.json:** revert to stable ara-identity ([e7ed073](https://github.com/arablocks/ara-util/commit/e7ed073b8bc2280ec303e578460b64b171c38f17))
* get correct doc owner ([b017093](https://github.com/arablocks/ara-util/commit/b017093a2e208d12aac13c170b6ea43e8d651447))
* update secret to keyrings ([835e8f6](https://github.com/arablocks/ara-util/commit/835e8f604ebae7391d3287285648bc5d9f04e388))


### Features

* **errors:** Allow MissingOptionError.expectedKey to be array ([98b68fc](https://github.com/arablocks/ara-util/commit/98b68fc70b3ea9825826b55e914f66f4ea404af0))
* Add MissingOptionError ([7b3e8b4](https://github.com/arablocks/ara-util/commit/7b3e8b461857f5e6755cd6f37095fce07b1ac195))
* **errors,keyring:** Add keyring funcs, add Ara errs ([41cdfa8](https://github.com/arablocks/ara-util/commit/41cdfa8fb80c0f8da558b56bca3d0cf1e4739b18))
* get eth address from did ([7db293f](https://github.com/arablocks/ara-util/commit/7db293f9db72c908ea902ab41a7ba1f99c2c8017))
* **index:** added keyring opts to validate and getAFSOwnerIdentity ([42e2568](https://github.com/arablocks/ara-util/commit/42e256893ac45eea4a8e451c016e78318e7a30e0))
* support pass in ddo to validate ([f0885d4](https://github.com/arablocks/ara-util/commit/f0885d45e925f9e9711082c40f7403d1592193f9))



## [0.3.3](https://github.com/arablocks/ara-util/compare/0.3.2...0.3.3) (2018-08-27)


### Bug Fixes

* need await :( ([55c3dc0](https://github.com/arablocks/ara-util/commit/55c3dc0af36657ace1a845a879a590655162fcd9))



## [0.3.2](https://github.com/arablocks/ara-util/compare/0.3.1...0.3.2) (2018-08-27)


### Bug Fixes

* scope ([157b4d7](https://github.com/arablocks/ara-util/commit/157b4d79e7f6fa7db7eaf5f8563970c7fd02819d))



## [0.3.1](https://github.com/arablocks/ara-util/compare/0.3.0...0.3.1) (2018-08-27)


### Features

* **web3/contract.js:** return gasLimit from contract deploy ([dddcede](https://github.com/arablocks/ara-util/commit/dddcede343e8897429da9b683d084e677cc80cc6))



# [0.3.0](https://github.com/arablocks/ara-util/compare/0.2.0...0.3.0) (2018-08-24)


### Bug Fixes

* **index.js:** update getDocumentOwner to use publicKey ([8e24fdd](https://github.com/arablocks/ara-util/commit/8e24fdd08b5be9786e7f180bdfcbd08fc1860711))


### Features

* move ara-contracts util functions ([3dc3f53](https://github.com/arablocks/ara-util/commit/3dc3f53e219de46de9c091e5c43e105c00b983cd))



# [0.2.0](https://github.com/arablocks/ara-util/compare/120e9ab0326496ef00739130fc351998c1e3ebed...0.2.0) (2018-08-24)


### Bug Fixes

* **index.js:** remove old log ([7facb3b](https://github.com/arablocks/ara-util/commit/7facb3be8874201b20612d9c6ad9e080bbb932b3))
* **web3/abi.js:** remove string conversion for function params ([08f506b](https://github.com/arablocks/ara-util/commit/08f506b2d527626d0d315e876aa56daaf8a090d0))
* cleanup error messages, start resolve migrate, secret-storage ([0ecdba6](https://github.com/arablocks/ara-util/commit/0ecdba6125c2558975fc78df2778013fcd1f8c48))
* cleanup error messages, start resolve migrate, secret-storage ([b98ecb7](https://github.com/arablocks/ara-util/commit/b98ecb7f979eea2c8b3f8f8eae8d770d67109f9b))
* **index.js:** remove pw requirement for validate ([88c2a47](https://github.com/arablocks/ara-util/commit/88c2a4702fff16b96527e9b2db1fb13495666554))


### Features

* **.npmrc:** npmrc file ([14096db](https://github.com/arablocks/ara-util/commit/14096dbc6c3a2bc98406536ea25cf88a773094b6))
* allow for configurable resolve opts, fix gitignore typo ([6537efa](https://github.com/arablocks/ara-util/commit/6537efa019f7c3287982a43f9b63557aba9bdc5a))
* first pass, migrate ara-web3 into ara-util/web3 ([e48bb6d](https://github.com/arablocks/ara-util/commit/e48bb6d93f413db516fe2c8e5177f4f4261f4a82))
* **index.js:** fleshed out rest of utility functions ([b0530ac](https://github.com/arablocks/ara-util/commit/b0530accd20825d672171d60e62b1b85a29a28e1))
* utility methods around did and ddos ([120e9ab](https://github.com/arablocks/ara-util/commit/120e9ab0326496ef00739130fc351998c1e3ebed))



