import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { UserAlredyExistsError } from '@/use-case/errors/users-alredy-exist';
import { RegisterUseCase } from '@/use-case/register';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'



export async function  register (request:FastifyRequest, reply: FastifyReply) {

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document_type: z.enum(['CPF', 'CNPJ']),
  document_number: z.string().refine(value => value.length == 11 || value.length == 14,{message: 'Document number must be exactly 11 or 14 characters long'}),
  password:  z.string().min(6),
  user_type: z.enum(['COMMON' , 'MERCHANT'])
}).superRefine((data, ctx) => {
   if(data.document_type == 'CPF' && data.document_number.length != 11) {
    if(data.user_type == 'COMMON') {
     ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'User type must be COMMON',
      path: ['user_type']
     })
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Document number must be exactly 11 characters long',
      path: ['document_number']
 
    })
  }
  if(data.document_type == 'CNPJ' && data.document_number.length != 14) {
    if(data.user_type == 'MERCHANT') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'User type must be CPF',
        path: ['user_type']
      
       })
       
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Document number must be exactly 11 characters long',
      path: ['document_number']
 
    })
  }
  return true
})

  const {name, email, document_type, document_number, password, user_type} = registerBodySchema.parse(request.body)
  
  try {
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
  } catch(err) {

    if(err instanceof z.ZodError) {
      return reply.status(400).send({message: err.message})
    }

    if(err instanceof UserAlredyExistsError) {
      return reply.status(409).send({message: err.message})
    }

    return reply.status(500).send({message: 'Internal server Error'})
  }
  return reply.status(201).send({message: 'User created'})
}