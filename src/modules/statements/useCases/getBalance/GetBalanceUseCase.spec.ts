import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

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
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUsersRepository
    );
  });

  it("Should not be able to get an user balance when user not exists", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "1231564871872" as string,
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("Should be able to get an user balance", async () => {
    const user = await inMemoryUsersRepository.create(newUser);
    newStatementDeposit.user_id = user.id;
    newStatementWithdraw.user_id = user.id;

    await inMemoryStatementRepository.create(newStatementDeposit);
    await inMemoryStatementRepository.create(newStatementWithdraw);

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });
    expect(response).toHaveProperty("statement");
    expect(response.balance).toBe(150);
  });
});
