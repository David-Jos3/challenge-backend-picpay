
export class MerchantTransferNotAllowedError extends Error {
  constructor() {
    super('Merchant type user cannot make transfer')
  }
}
