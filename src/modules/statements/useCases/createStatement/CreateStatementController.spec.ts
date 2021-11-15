import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create statement - Test Integration", () => {
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

  it("Should be able add credit", async () => {
    const resultToken = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "123456",
    });

    const { token } = resultToken.body;

    const result = await request(app)
      .post("/statements/deposit")
      .send({
        amount: 200,
        description: "Credit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty("id");
    expect(result.body.amount).toBe(200);
  });

  it("Should be able debit", async () => {
    const resultToken = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "123456",
    });

    const { token } = resultToken.body;

    const result = await request(app)
      .post("/statements/withdraw")
      .send({
        amount: 40,
        description: "Debit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty("id");
    expect(result.body.amount).toBe(40);
  });

  it("Should not be able debit without cash", async () => {
    const resultToken = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "123456",
    });

    const { token } = resultToken.body;

    const result = await request(app)
      .post("/statements/withdraw")
      .send({
        amount: 1000,
        description: "Debit without cash",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(result.status).toBe(400);
  });
});
