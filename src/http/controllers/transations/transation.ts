import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transations-repository';
import { PrismaWalletRepository } from '@/repositories/prisma/prisma-wallet-repository';
import { TransactionsUseCase } from '@/use-case/transations';
import { FastifyRequest, FastifyReply } from 'fastify';
import z from 'zod'

export async function transaction (request:FastifyRequest, reply: FastifyReply) {

const trasationsBodySchema = z.object({
  amount: z.number(),
  status: z.string(),   
  payerId: z.string(),  
  payeeId:z.string()  
})
  const {amount, status, payerId,payeeId} = trasationsBodySchema.parse(request.body)

  try {
    const transactionRepository = new PrismaTransactionsRepository()
    const walletRepository = new PrismaWalletRepository()
    const transactionUseCase = new TransactionsUseCase(transactionRepository, walletRepository)
  
     await transactionUseCase.execute({
      amount,
      status,
      payerId,
      payeeId
    })

  } catch (err){
    if(err instanceof z.ZodError){
      return reply.status(400).send({message: err.message})
    }
    return reply.status(500).send({message: 'Internal Server Error'})
  }

  reply.status(201).send({message: 'successful transaction '})
}