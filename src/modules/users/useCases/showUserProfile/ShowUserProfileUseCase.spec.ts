import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "outroqualquer",
      password: "123",
    });

    const profile = await showUserProfileUseCase.execute(user.id);

    expect(profile).toHaveProperty("id");
    expect(profile.name).toBe("Lucas");
  });
  it("should not be able to show user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("use_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
