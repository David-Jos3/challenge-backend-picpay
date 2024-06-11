export class AuthorizationTransactionError extends Error {
  constructor() {
    super('Transaction not authorized')
  }
}