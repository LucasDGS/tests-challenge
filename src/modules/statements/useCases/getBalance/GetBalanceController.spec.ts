import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get Balance - Test Integration", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("123456", 8);

    await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
    VALUES('${id}', 'admin', 'admin@email.com', '${password}', 'now()', 'now()')`);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get an user balance", async () => {
    const resultToken = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "123456",
    });

    const { token } = resultToken.body;

    await request(app)
      .post("/statements/deposit")
      .send({
        amount: 200,
        description: "Credit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const balance = await request(app)
      .get("/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(balance.body).toHaveProperty("statement");
  });
  it("Should not be able to get an user balance when user not exists", async () => {
    const token = "123165487";
    const balance = await request(app)
      .get("/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(balance.status).toBe(401);
  });
});
