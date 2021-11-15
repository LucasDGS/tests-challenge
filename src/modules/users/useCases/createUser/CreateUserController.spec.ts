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

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "Lucas",
      email: "lucas@example",
      password: "123",
    });
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with email already registered", async () => {
    const response = await request(app).post("/users").send({
      name: "Lucas",
      email: "lucas@example",
      password: "123",
    });
    expect(response.status).toBe(400);
  });
});