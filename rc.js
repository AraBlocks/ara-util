const extend = require('extend')
const rc = require('ara-runtime-configuration')
const os = require('os')
const { resolve } = require('path')

const kAraDir = '.ara'
const kSecretDir = 'secret'

const defaults = () => ({
  secret: {
    archiver: resolve(os.homedir(), kAraDir, kSecretDir, 'ara-archiver.pub'),
    resolver: resolve(os.homedir(), kAraDir, kSecretDir, 'ara-resolver.pub')
  }
})

module.exports = conf => rc(extend(true, {}, defaults(), conf))
