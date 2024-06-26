import { PrismaWalletRepository } from '@/repositories/prisma/prisma-wallet-repository';
import { WalletCreationError } from '@/use-case/errors/wallet-creation-error';
import { WalletUseCase } from '@/use-case/wallet';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'



export async function wallet (request:FastifyRequest, reply: FastifyReply) {

const createWalletSchema = z.object({
 userId: z.string(),
 balance: z.number()
})

const {userId, balance} = createWalletSchema.parse(request.body)
  try{
    const walletRepository = new PrismaWalletRepository()
    const walletUseCase = new WalletUseCase(walletRepository)
     await walletUseCase.execute({
      userId,
      balance
    })
  } catch(error) {
    if(error instanceof z.ZodError){
      return reply.status(400).send({message: error.message})
    }

    if(error instanceof WalletCreationError) {
      return reply.status(400).send({message: error.message})
    }
    return reply.status(500).send({message: 'Internal Server Error'})
  }
  reply.status(201).send({message: 'Wallet created'})
}