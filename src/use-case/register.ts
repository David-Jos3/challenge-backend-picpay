import { DocumentType, User, UserType } from "@prisma/client";
import { UserRepository } from "@/repositories/user-repository";
import { UserAlredyExistsError } from "./errors/users-alredy-exist";

export interface ResgisterUseCaseRequest {
  name: string;
  email: string;
  document_type: DocumentType;
  document_number: string;
  password: string;
  user_type: UserType
}

export interface ResgisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, document_number, document_type, password, user_type }: ResgisterUseCaseRequest): Promise<ResgisterUseCaseResponse> {  
  const userExists = await this.userRepository.findByEmail(email)
    if (userExists) {
      throw new UserAlredyExistsError();
    }
    const user = await this.userRepository.create({
      name,
      email,
      document_type,
      document_number: document_number.replace(/\D/g, ''),
      password,
      user_type
    });
   
  
    return { user };
  }
}
