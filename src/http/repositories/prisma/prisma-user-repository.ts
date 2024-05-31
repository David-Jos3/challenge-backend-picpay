import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository";
import { prisma } from "@/lib/prisma";


export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data
    })
  }
}