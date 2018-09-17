module.exports = {
  aidPrefix: 'did:ara:',
  secret: 'c',
  archiverNetworkName: 'archiver',
  password: 'c',
  mnemonic: 'what a mnemonic',
  ddo: {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
    publicKey: [ {
      id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner',
      type: 'Ed25519VerificationKey2018',
      owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
      publicKeyHex: 'd93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
      publicKeyBase58: 'Fcyrsvgzvwna5ba1CLTZccfAdrqwRS6unD5LYsfy2gnM',
      publicKeyBase64: 'Nk7PK+ko686d0lZqzEBHkjJ6sUIceIqD9LsVlNEjCcq'
    }, {
      id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#eth',
      type: 'Secp256k1VerificationKey2018',
      owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
      publicKeyHex: '7872b4a4dbbdcbec2b89f1e8e9c1d98a6ebee30eb9cb714f4edfe5b05f08c64e6e69cf6e301dae1e82275b7074166bc755b6da3048a3cbd0d25c925a6a3abf8b',
      publicKeyBase58: '3QfzY6FVrYpTXfXUiH83pEFaF53K1eP1FmY9V4yJ1mFkzJpnHpCKXNTpHxQ7TvKJYLKo8fRMaLsBznF8dLC2fyES',
      publicKeyBase64: 'B4crSk273L7CuJ8ejpwdmKbr7jDrnLcU9O3+WwXwjGTm5pz24wHa4egidbcHQWa8dVttowSKPL0NJcklpqOr+L'
    }, {
      id: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#metadata',
      type: 'Ed25519VerificationKey2018',
      owner: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a',
      publicKeyHex: '438b21df4533e5ad4e537c2a152315d384780384b93a451087d93d7fb6cb67c2',
      publicKeyBase58: '5YfNB78G9xaKbFQYrJF7Rr3nRPaGAD9Z23MH4DbgBx2D',
      publicKeyBase64: 'EOLId9FM+WtTlN8KhUjFdOEeAOEuTpFEIfZPX+2y2fC'
    } ],
    authentication: [ {
      publicKey: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner',
      type: 'Ed25519SignatureAuthentication2018'
    }, {
      publicKey: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#eth',
      type: 'Secp256k1SignatureAuthentication2018'
    }, {
      publicKey: 'did:ara:5b039baf6fcdc87c8fcfa24f0795861d6f09804ec4fbcfce2979c654094e9b48#owner',
      type: 'Ed25519VerificationKey2018'
    } ],
    service: [],
    created: '2018-09-13T17:52:57.237Z',
    updated: '2018-09-13T17:52:57.237Z',
    proof: {
      type: 'Ed25519VerificationKey2018',
      nonce: '755c7d1606e524908091bd8971d8eed88c458893c794bb30b31a65944a98761b',
      domain: 'ara',
      created: '2018-09-13T17:52:57.239Z',
      creator: 'did:ara:d93b3cafa4a3af3a774959ab31011e48c9eac50871e22a0fd2ec5653448c272a#owner',
      signatureValue: '9d57555557302c104638a6f1748e9c03b45e67415a72d9382c2b9b6dc01ef534ff88f4444efd88a9cbefa3be91ae6e4a65b391cf52c91977c6fa8ebc19e02902'
    }
  },
  araKeystore: {
    id: 'fcc811bb-cffa-4939-9fc7-389e5dd412ba',
    version: '0000000000000101',
    crypto: {
      cipherparams: {
        iv: 'f5b67cccdc096fd605a8b22096cbb46b'
      },
      ciphertext: '22fdf3c2845b8efdbba0b82f4ac22c93b969dfee54a8fd58bfec08e592e0c369b099d69728ce212c79349737e82b163a9119790d6dc8a7ac4f38593d2cbba9f4',
      cipher: 'aes-128-ctr',
      digest: 'sha1',
      mac: 'fc86a30a946d5d696363f8925f834e5ef73936fd'
    }
  }
}
