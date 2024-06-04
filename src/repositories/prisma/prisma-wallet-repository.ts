import { prisma } from '@/lib/prisma';
import { WalletRepository } from '../wallet-repository';

export class PrismaWalletRepository implements WalletRepository {
  async updateBalance(amount: number, userId: string){
    const walletBalance = await prisma.wallet.update({
      where: {
        user_id: userId
      },
      data: {
        balance: amount
      }
    })
    return walletBalance
  }
 async findByUserId(userId: string) {
    const walletUser = await prisma.wallet.findFirst(
      {where: {user_id : userId} }
    )
    return walletUser
  }

  async create(userId: string, balance: number) {
    const wallet = await prisma.wallet.create({
      data: {
        user: { connect: { id: userId } },
        balance
      }
    });
    return wallet;
  }
}