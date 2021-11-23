import { Request, Response } from "express";
import { container } from "tsyringe";

import { TransferBetweenAccountsUseCase } from "./TransferBetweenAccountsUseCase";

export enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

class TransferBetweenAccountsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { id: sender_user_id } = request.user;
    const { receiver_user_id } = request.params;

    const transferBetweenAccountsUseCase = container.resolve(
      TransferBetweenAccountsUseCase
    );

    const transferStatement = await transferBetweenAccountsUseCase.execute({
      amount,
      description,
      sender_user_id,
      receiver_user_id,
    });

    return response.status(201).json(transferStatement);
  }
}

export { TransferBetweenAccountsController };
