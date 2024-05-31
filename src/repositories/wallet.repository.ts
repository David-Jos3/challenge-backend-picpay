import { Wallet } from "@prisma/client";

export interface WalletRepository {
  create(userId: string, balance:number): Promise<Wallet>
}