import { Prisma } from "@prisma/client";
import { TransactionsRepository } from "../transations-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTransactionsRepository implements TransactionsRepository {

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
