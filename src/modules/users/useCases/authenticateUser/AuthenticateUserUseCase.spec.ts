import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Lucas",
      email: "lucasdaniel@hotmail.com",
      password: "123",
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty("token");
    expect(user.name).toBe("Lucas");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Lucas",
        email: "lucasdaniel@hotmail.com",
        password: "123",
      };
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password or email", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Lucas",
        email: "lucasdaniel@hotmail.com",
        password: "123",
      };

      await authenticateUserUseCase.execute({
        email: "any",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
