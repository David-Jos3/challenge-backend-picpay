import { UserAlredyExistsError } from './errors/users-alredy-exist';
import { Transaction } from "@prisma/client"
import {TransactionsRepository } from '@/repositories/transations-repository'
import { WalletRepository } from "@/repositories/wallet-repository"
import { InsufficientBalanceError } from './errors/balance-error';

export interface TransationsUseCaseRequest {
  amount: number
  status: string
  payerId: string
  payeeId: string
}

export interface TransationsUseCaseResponse {
  transation: Transaction
}

export class TransactionsUseCase  {
  constructor(
    private transactionRepository: TransactionsRepository, 
    private walletRepository: WalletRepository
  ) {}


  async execute({amount, status, payerId, payeeId}: TransationsUseCaseRequest): Promise<TransationsUseCaseResponse> {

    const payerWallet = await this.walletRepository.findByUserId(payerId)
    const payeeWallet = await this.walletRepository.findByUserId(payeeId)

    if(!payeeWallet || !payerWallet) {
      throw new Error(`${!payeeWallet ? 'payee' : 'payer'} Wallet not found`)
    }

    if(payerWallet.balance === 0 || payerWallet.balance < amount ) {
      throw new InsufficientBalanceError
    }

    const newPayerBalance = payerWallet?.balance - amount
    const newPayeeBalance = payeeWallet?.balance + amount


    await this.walletRepository.updateBalance( newPayerBalance, payerId)
    await this.walletRepository.updateBalance(newPayeeBalance, payeeId)
    

    const transation = await this.transactionRepository.create({
      amount,
      status,
      payerId,
      payeeId,
    })

    return { transation }
  }

}