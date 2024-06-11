import { AuthorizationTransaction } from '@/http/service/authorization-transactions-service';
import { MerchantTransferNotAllowedError } from './../../../use-case/errors/merchant-transfer-error';
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transations-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaWalletRepository } from '@/repositories/prisma/prisma-wallet-repository';
import { TransactionsUseCase } from '@/use-case/transations';
import { FastifyRequest, FastifyReply } from 'fastify';
import z from 'zod'
import { AuthorizationTransactionError } from '@/use-case/errors/authorized-transactions-error';
import { NotificationService } from '@/http/service/notification-service';

export async function transaction (request:FastifyRequest, reply: FastifyReply) {

const trasationsBodySchema = z.object({
  amount: z.number(),
  status: z.string().optional(),   
  payerId: z.string(),  
  payeeId:z.string()  
})
  const {amount, status, payerId,payeeId} = trasationsBodySchema.parse(request.body)

  try {
    const transactionRepository = new PrismaTransactionsRepository()
    const walletRepository = new PrismaWalletRepository()
    const userRepository = new PrismaUserRepository()
    const authorizationTransactions = new AuthorizationTransaction()
    const notificationService = new NotificationService()
    const transactionUseCase = new TransactionsUseCase(transactionRepository, walletRepository, userRepository, authorizationTransactions, notificationService)
  
     await transactionUseCase.execute({
      amount,
      status,
      payerId,
      payeeId
    })

  } catch (error){
    if(error instanceof z.ZodError){
      return reply.status(400).send({message: error.message})
    }

    if(error instanceof MerchantTransferNotAllowedError) {
      return reply.status(400).send({message: error.message})
    }

    if(error instanceof AuthorizationTransactionError) {
      return reply.status(401).send({message: error.message})
    }

    return reply.status(500).send({message: 'Internal Server Error'})
  }

  reply.status(201).send({message: 'successful transaction '})
}