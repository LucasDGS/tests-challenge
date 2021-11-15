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

  it("should be able to show user profile", async () => {
    await request(app).post("/users").send({
      name: "Lucas",
      email: "lucas@example",
      password: "123",
    });

    const responseToken = await request(app).post("/sessions").send({
      email: "lucas@example",
      password: "123",
    });

    const { token } = responseToken.body;

    const profile = await request(app)
      .get("/profile")
      .set({ Authorization: `Bearer ${token}` });
    expect(profile.body).toHaveProperty("id");
  });

  it("should not be able to show profile with invalid token", async () => {
    const profile = await request(app)
      .get("/profile")
      .set({ Authorization: `Bearer ${"126548979824"}` });
    expect(profile.status).toBe(401);
  });
});
