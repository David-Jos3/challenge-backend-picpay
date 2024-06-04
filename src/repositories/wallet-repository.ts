import { Wallet } from '@prisma/client';

export interface WalletRepository {
  updateBalance(balance: number, userId: string):Promise<Wallet | null>;
  findByUserId(userId: string):  Promise<Wallet | null>
  create(userId: string, amount: number): Promise<Wallet>;
}