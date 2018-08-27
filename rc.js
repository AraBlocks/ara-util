const extend = require('extend')
const rc = require('ara-runtime-configuration')

const defaults = () => ({
  network: {
    identity: {
      archiver: 'ara-archiver',
      resolver: 'ara-resolver'
    }
  }
})

module.exports = conf => rc(extend(true, {}, defaults(), conf))
