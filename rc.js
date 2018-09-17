const extend = require('extend')
const rc = require('ara-runtime-configuration')
const os = require('os')
const { resolve } = require('path')

const kAraDir = '.ara'
const kSecretDir = 'keyrings'

const defaults = () => ({
  network: {
    identity: {
      archiver: resolve(os.homedir(), kAraDir, kSecretDir, 'archiver.pub'),
      resolver: resolve(os.homedir(), kAraDir, kSecretDir, 'resolver.pub')
    }
  }
})

module.exports = conf => rc(extend(true, {}, defaults(), conf))
