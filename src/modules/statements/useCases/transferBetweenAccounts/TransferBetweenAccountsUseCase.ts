import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferBetweenAccountsError } from "./TransferBetweenAccountsError";

export enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

interface IRequest {
  amount: number;
  description: string;
  sender_user_id: string;
  receiver_user_id: string;
}

@injectable()
class TransferBetweenAccountsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  public async execute({
    amount,
    description,
    sender_user_id,
    receiver_user_id,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(sender_user_id);

    if (!user) {
      throw new TransferBetweenAccountsError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_user_id,
    });

    if (balance < amount) {
      throw new TransferBetweenAccountsError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: sender_user_id,
      amount,
      description,
      type: OperationType.TRANSFER,
      receiver_user_id,
    });
  }
}

export { TransferBetweenAccountsUseCase };
