/**
 * Error for a function not getting a required param
 */

class MissingParamError extends Error {
  /**
   * Create a missing param error
   *
   * @param  {String} options.expected      Description of expected key (It should be a path like 'opts.keyring' or 'keyring')
   * @param  {Object} options.actual        Object of the received value
   * @param  {String} options.suggestion    Prepended with `Try`, (ex: `passing the variable`)
   *
   * @return {MissingParamError}
   */
  constructor({ expected, actual, suggestion }) {
    if (Array.isArray(expected)) {
      expected = expected.map(k => `\`${k}\``).join('or')
    } else {
      expected = `\`${expected}\``
    }

    super(`Missing ${expected}, got ${JSON.stringify(actual)}, ${suggestion ? `.\n Try ${suggestion}` : ''}`)

    this.name = 'MissingParamError'
    this.expected = expected
    this.actual = actual
    this.suggestion = suggestion
  }
}

module.exports = { MissingParamError }
