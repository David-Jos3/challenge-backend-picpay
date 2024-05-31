import { Prisma } from '@prisma/client';
import {prisma} from '../../lib/prisma'
import { UserRepository } from '../user.repository';


export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data
    })
    return  user  
  }
}