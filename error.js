/**
 * Error for a function not getting a required option
 */

class MissingOptionError extends Error {
  /**
   * Create a missing option error
   * 
   * @param  {String} options.expectedKey   Description of expected key (It should be a path like 'opts.keyring' or 'keyring')
   * @param  {Object} options.actualValue   Object of the received value
   * @param  {String} options.suggestion    Prepended with `Try`, (ex: `passing the variable`)
   * 
   * @return {MissingOptionError}
   */
  constructor({ expectedKey, actualValue, suggestion }) {
    super(`Missing \`${expectedKey}\`, got ${JSON.stringify(actualValue)}, ${suggestion ? `.\n Try ${suggestion}` : ''}`)

    this.name = 'MissingOptionError'
    this.expectedKey = expectedKey
    this.actualValue = actualValue
    this.suggestion = suggestion
  }
}

module.exports = MissingOptionError
