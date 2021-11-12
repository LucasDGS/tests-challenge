import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should not be able to create a statement when user not exists ", async () => {
    expect(async () => {
      const depositOp: ICreateStatementDTO = {
        user_id: "any_id",
        amount: 150,
        description: "pagamento de salário",
        type: OperationType.DEPOSIT,
      };
      await createStatementUseCase.execute(depositOp);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should be able to create a new Statement with deposit type", async () => {
    const userData: ICreateUserDTO = {
      name: "Lucas",
      email: "lucasdaniel",
      password: "senha",
    };
    const user = await createUserUseCase.execute(userData);

    const newStatement: ICreateStatementDTO = {
      user_id: user.id,
      amount: 100,
      description: "pagamento de salário",
      type: OperationType.DEPOSIT,
    };

    const statement = await createStatementUseCase.execute(newStatement);
    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(newStatement.amount);
    expect(statement.type).toEqual(newStatement.type);
  });

  it("Should not be able to create a statement with withdraw type when user hasn't money", async () => {
    expect(async () => {
      const userData: ICreateUserDTO = {
        name: "Lucas",
        email: "lucasdaniel",
        password: "senha",
      };
      const user = await createUserUseCase.execute(userData);

      const withdrawOp: ICreateStatementDTO = {
        user_id: user.id,
        amount: 150,
        description: "Roupas",
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(withdrawOp);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
