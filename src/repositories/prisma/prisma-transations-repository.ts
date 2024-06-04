import { Prisma } from "@prisma/client";
import { TransactionsRepository } from "../transations-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTransactionsRepository implements TransactionsRepository {

  async  findByPayeeId(payeeId: string){
    const transaction = await  prisma.transaction.findFirst({
      where: {
        payeeId: payeeId
      }
    })
    return transaction
  }

 async findByPayerId(payerId: string){
    const transaction = await  prisma.transaction.findFirst({
      where: {
        payerId: payerId
      }
    })
    return transaction
  }

 async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data
    });
    return transaction;
  }
  
}
