import {  Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository";
import { prisma } from "@/lib/prisma";


export class PrismaUserRepository implements UserRepository {
 
 async findByEmail(email: string){
   return await prisma.user.findUnique({where: {email}})
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data
    })
  }
}