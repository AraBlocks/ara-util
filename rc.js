const extend = require('extend')
const rc = require('ara-runtime-configuration')
const os = require('os')

const defaults = () => ({
  network: {
    identity: {
      root: `${os.homedir()}/.ara/identities`,
      archiver: 'archiver',
      resolver: 'resolver'
    }
  }
})

module.exports = conf => rc(extend(true, {}, defaults(), conf))
