class AraError extends Error {
  constructor(message, error) {
    super(message) 

    this.name = 'AraError'
    this.error = error
    this.message = message
  }

  toString() {
    return `(${this.name}): ${this.message}\n${this.error}`
  }
}

class KeyringError extends AraError {
  constructor(message) {
    super(message)

    this.name = 'KeyringError'
    this.message = message
  }
}

module.exports = {
  AraError,
  KeyringError
}