import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transations-repository';
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

  const transactionRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new TransactionsUseCase(transactionRepository)

  const transactions =  await transactionUseCase.execute({
    amount,
    status,
    payerId,
    payeeId
  })

}