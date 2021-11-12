import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

const newUser: ICreateUserDTO = {
  name: "Lucas",
  email: "Lucas@Lucas.com",
  password: "123",
};

const newStatementDeposit: ICreateStatementDTO = {
  user_id: "",
  amount: 200,
  description: "pagamento de salário",
  type: OperationType.DEPOSIT,
};
const newStatementWithdraw: ICreateStatementDTO = {
  user_id: "",
  amount: 50,
  description: "supermercado",
  type: OperationType.WITHDRAW,
};

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("Should not be able to get statement operation when user not exists", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create(newUser);
      newStatementDeposit.user_id = user.id;

      const statement = await inMemoryStatementRepository.create(
        newStatementDeposit
      );

      await getStatementOperationUseCase.execute({
        user_id: "1231564871872" as string,
        statement_id: statement.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get statement operation when statement not exists", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create(newUser);
      newStatementDeposit.user_id = user.id;

      await inMemoryStatementRepository.create(newStatementDeposit);

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "1223541623",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("Should be able to get an user operation statement", async () => {
    const user = await inMemoryUsersRepository.create(newUser);
    newStatementDeposit.user_id = user.id;
    newStatementWithdraw.user_id = user.id;

    const statement = await inMemoryStatementRepository.create(
      newStatementDeposit
    );
    const statementOp = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });
    expect(statementOp).toHaveProperty("id");
    expect(statementOp.amount).toBe(200);
  });
});
