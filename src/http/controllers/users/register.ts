
import { PrismaUserRepository } from '@/repositories/prisma/prisma.user.repository';
import { UserAlredyExistsError } from '@/use-case/errors/users-alredy-exist';
import { RegisterUseCase } from '@/use-case/register';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'



export async function  register (request:FastifyRequest, reply: FastifyReply) {

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document_type: z.enum(['CPF', 'CNPJ']),
  document_number: z.string(),
  password:  z.string().min(6),
  user_type: z.enum(['COMMON' , 'MERCHANT'])
})


  const {name, email, document_type, document_number, password, user_type} = registerBodySchema.parse(request.body)
  try{
    const userRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)
    await registerUseCase.execute({
      name,
      email,
      document_type,
      document_number,
      password,
      user_type
    })
  } catch(error) {
    if(error instanceof z.ZodError){
      return reply.status(400).send({message: error.message})
    }

    if(error instanceof UserAlredyExistsError ) {
      return reply.status(409).send({message: error.message})
    }
  }
}