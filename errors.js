/**
 * Error for a function not getting a required param
 */

class MissingParamError extends Error {
  /**
   * Create a missing param error
   *
   * @param  {String} options.expectedKey   Description of expected key (It should be a path like 'opts.keyring' or 'keyring')
   * @param  {Object} options.actualValue   Object of the received value
   * @param  {String} options.suggestion    Prepended with `Try`, (ex: `passing the variable`)
   *
   * @return {MissingParamError}
   */
  constructor({ expectedKey, actualValue, suggestion }) {
    if (Array.isArray(expectedKey)) {
      expectedKey = expectedKey.map(k => `\`${k}\``).join('or')
    } else {
      expectedKey = `\`${expectedKey}\``
    }

    super(`Missing ${expectedKey}, got ${JSON.stringify(actualValue)}, ${suggestion ? `.\n Try ${suggestion}` : ''}`)

    this.name = 'MissingParamError'
    this.expectedKey = expectedKey
    this.actualValue = actualValue
    this.suggestion = suggestion
  }
}

module.exports = { MissingParamError }
