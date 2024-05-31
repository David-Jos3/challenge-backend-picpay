
export class WalletCreatedError extends Error {
  constructor(){
    super('An error occurred while creating the wallet')
  };
}