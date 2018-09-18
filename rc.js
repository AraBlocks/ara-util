const extend = require('extend')
const rc = require('ara-runtime-configuration')
const os = require('os')
const { resolve } = require('path')

const ARA_DIR = '.ara'
const SECRET_DIR = 'keyrings'

const defaults = () => ({
  network: {
    identity: {
      root: `${os.homedir()}/.ara/identities`,
      archiver: resolve(os.homedir(), ARA_DIR, SECRET_DIR, 'archiver.pub'),
      resolver: resolve(os.homedir(), ARA_DIR, SECRET_DIR, 'resolver.pub')
    }
  }
})

module.exports = conf => rc(extend(true, {}, defaults(), conf))
