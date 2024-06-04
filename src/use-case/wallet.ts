import { Wallet } from "@prisma/client";
import { WalletCreationError } from "./errors/wallet-creation-error";
import { WalletRepository } from "@/repositories/wallet-repository";


export interface WalletUseCaseRequest {
  userId: string
  balance: number
}

export interface WalletUseCaseResponse {
  wallet: Wallet;
}

export class WalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute({userId, balance }: WalletUseCaseRequest): Promise<WalletUseCaseResponse> {
    const wallet = await this.walletRepository.create(userId, balance);

    if (!wallet) {
      throw new WalletCreationError();
    }

    return { wallet };
  }
}