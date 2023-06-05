import request from "supertest";
import { app } from "../app";
import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// interfaces to provide better type safety
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

interface Task {
  title: string;
  user: string;
}

// global variables
let db: typeof mongoose;
let newUser: any;
let newTask: any;

beforeAll(async () => {
  const ATLAS_URI = process.env.ATLAS_URI || "";
  db = await mongoose.connect(ATLAS_URI);
});

describe("User actions", () => {
  describe("createUser", () => {
    test("should create a user", async () => {
      const response = await request(app).post("/users/create").send({
        name: "jack",
        email: "jack@gmail.com",
        password: "jack",
      });
      newUser = response.body.newUser;
      expect(response.statusCode).toBe(200);
    });
    test("should return status 400 if some of input field value is missing", async () => {
      const response1 = await request(app)
        .post("/users/create")
        .send({ name: "", email: "jack@gmail.com", password: "jack" });
      const response2 = await request(app).post("/users/create").send({
        name: "jack",
        email: "",
        password: "jack",
      });
      const response3 = await request(app).post("/users/create").send({
        name: "jack",
        email: "jack@gmail.com",
        password: "",
      });
      expect(response1.statusCode).toBe(400);
      expect(response2.statusCode).toBe(400);
      expect(response3.statusCode).toBe(400);
    });
    test("should return status 404 if there is a user with such email already", async () => {
      const response = await request(app).post("/users/create").send(newUser);
      expect(response.statusCode).toBe(404);
    });
  });
  describe("authUser", () => {
    test("should authorize a user", async () => {
      const response = await request(app)
        .post("/users/auth")
        .send({ email: "jack@gmail.com", password: "jack" });
      newUser = response.body.updatedUser;
      expect(response.statusCode).toBe(200);
    });
  });
  test("should retrieve users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
    expect(response.statusCode).toBe(200);
  });
  test("should delete a user", async () => {
    const response = await request(app)
      .delete("/users/delete/jack@gmail.com")
      .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
    expect(response.statusCode).toBe(200);
  });
});
describe("Tasks actions", () => {
  test("should create a task", async () => {
    const responseUser = await request(app).post("/users/create").send({
      name: "jack",
      email: "jack@gmail.com",
      password: "jack",
    });
    newUser = responseUser.body.newUser;

    const response = await request(app)
      .post("/tasks/create")
      .send({ title: "read 10 pages of a book", user_id: newUser._id })
      .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
    newTask = response.body.newTask;
    expect(response.statusCode).toBe(200);
  });
  test("should delete a task", async () => {
    const response = await request(app)
      .delete(`/tasks/delete/${newTask._id}`)
      .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
    expect(response.statusCode).toBe(200);
    await request(app)
      .delete("/users/delete/jack@gmail.com")
      .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
  });
});

afterAll(async () => {
  await db.disconnect();
});
