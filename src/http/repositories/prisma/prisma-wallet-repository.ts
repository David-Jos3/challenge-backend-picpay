import { prisma } from '@/lib/prisma';
import { WalletRepository } from '../wallet-repository';

export class PrismaWalletRepository implements WalletRepository {
  async create(userId: string, balance: number) {
    const wallet = await prisma.wallet.create({
      data: {
        user: { connect: { id: userId } },
        balance: balance
      }
    });
    return wallet;
  }
}