import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    await request(app).post("/users").send({
      name: "Lucas",
      email: "lucas@example",
      password: "123",
    });

    const responseToken = await request(app).post("/sessions").send({
      email: "lucas@example",
      password: "123",
    });
    expect(responseToken.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with incorrect email", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "lucasa@example",
      password: "123",
    });
    expect(responseToken.status).toBe(401);
  });
  it("should not be able to authenticate an user with incorrect password", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "lucas@example",
      password: "13",
    });
    expect(responseToken.status).toBe(401);
  });
});
