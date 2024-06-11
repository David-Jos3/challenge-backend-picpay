import { NotificationRequest } from './../http/service/notification-service';
import { Transaction } from "@prisma/client"
import {TransactionsRepository } from '@/repositories/transations-repository'
import { WalletRepository } from "@/repositories/wallet-repository"
import { InsufficientBalanceError } from './errors/balance-error';
import { UserRepository } from "@/repositories/user-repository";
import { MerchantTransferNotAllowedError } from "./errors/merchant-transfer-error";
import { AuthorizationTransaction } from "@/http/service/authorization-transactions-service";
import { AuthorizationTransactionError } from "./errors/authorized-transactions-error";
import { NotificationService } from "@/http/service/notification-service";


export interface TransationsUseCaseRequest {
  amount: number
  status?: string
  payerId: string
  payeeId: string
}

export interface TransationsUseCaseResponse {
  transation: Transaction
}

export class TransactionsUseCase  {
  constructor(
    private transactionRepository: TransactionsRepository, 
    private walletRepository: WalletRepository,
    private userRepository: UserRepository,
    private authorizationTransactions: AuthorizationTransaction ,
    private notificationService: NotificationService
  ) {}


  async execute({amount,payerId, payeeId}: TransationsUseCaseRequest): Promise<TransationsUseCaseResponse> {

    const payerWallet = await this.walletRepository.findByUserId(payerId)
    const payeeWallet = await this.walletRepository.findByUserId(payeeId)
    const payerUser = await this.userRepository.findById(payerId)
    const payeeUser = await this.userRepository.findById(payeeId)

    if(payerUser!.user_type === 'MERCHANT' ) {
      throw new  MerchantTransferNotAllowedError    
      
    }

    if(!payeeWallet || !payerWallet) {
      throw new Error(`${!payeeWallet ? 'payee' : 'payer'} Wallet not found`)
    }

    if(payerWallet?.balance === 0 || payerWallet?.balance < amount ) {
      throw new InsufficientBalanceError
    }

    const authorize =  await this.authorizationTransactions.authorize()

    if(authorize.status !== 'success' || !authorize.data.authorization) {
      throw new AuthorizationTransactionError
    }

    const newPayerBalance = payerWallet!.balance - amount
    const newPayeeBalance = payeeWallet!.balance + amount


    await this.walletRepository.updateBalance(newPayerBalance, payerId)
    await this.walletRepository.updateBalance(newPayeeBalance, payeeId)

     
 
    const transation = await this.transactionRepository.create({
      amount,
      status: authorize.status,
      payerId,
      payeeId,
    })

   
    await this.notificationService.notify({
        from: payerUser!.email,
        to:payeeUser!.email,
        subject: 'notification received',
        text: `You sent a transaction of ${amount} to ${payeeUser?.name}.`,
      })
  
     await this.notificationService.notify({
      from: payeeUser!.email,
      to:payerUser!.email,
      subject: 'notification received',
      text: `You received a transaction worth ${amount} from ${payerUser?.name}.` ,
      })
    
    return { transation }
  }

}