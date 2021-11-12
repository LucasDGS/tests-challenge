import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe(" Create New User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("should create new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucasdaniel@hotmail.com",
      password: "123",
    });
    expect(user).toHaveProperty("id");
  });

  it("should not be able to create new user that already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Lucas 1",
        email: "lucasdaniel@hotmail.com",
        password: "123",
      });

      await createUserUseCase.execute({
        name: "Lucas",
        email: "lucasdaniel@hotmail.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
