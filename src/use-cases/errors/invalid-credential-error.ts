export class InvalidCredentialError extends Error {
  constructor() {
    super('Invalid credential')
    this.name = 'InvalidCredentialError'
  }
}
