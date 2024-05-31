
import { PrismaWalletRepository } from '@/repositories/prisma/prisma.wallet';
import { WalletUseCase } from '@/use-case/create-wallet';
import { WalletCreatedError } from '@/use-case/errors/wallet-create-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'



export async function  createWallet (request:FastifyRequest, reply: FastifyReply) {

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
    if(error instanceof WalletCreatedError) {
      return reply.status(400).send({message: error.message})
    }
    throw error
    }
    return reply.code(201).send({
      message: 'Wallet created'
    }) 
  }
