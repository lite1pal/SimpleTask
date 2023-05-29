import request from "supertest";
import { app } from "../app";
import mongoose, { Document } from "mongoose";
import User from "../models/usersModel";
import dotenv from "dotenv";
dotenv.config();

// interfaces to provide better type safety
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
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
  test("should retrieve users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });
  describe("createUser", () => {
    test("should create a user", async () => {
      const response = await request(app).post("/users/create").send({
        name: "jack",
        email: "jack@gmail.com",
        password: "jack",
        age: 25,
      });
      newUser = response.body.newUser;
      expect(response.statusCode).toBe(200);
    });
    test("should return status 400 if some of input field value is missing", async () => {
      const response1 = await request(app)
        .post("/tasks/create")
        .send({ name: "", email: "jack@gmail.com", password: "jack", age: 10 });
      const response2 = await request(app).post("/users/create").send({
        name: "jack",
        email: "",
        password: "jack",
        age: 10,
      });
      const response3 = await request(app).post("/users/create").send({
        name: "jack",
        email: "jack@gmail.com",
        password: "",
        age: 10,
      });
      const response4 = await request(app).post("/users/create").send({
        name: "jack",
        email: "jack@gmail.com",
        password: "jack",
        age: null,
      });
      expect(response1.statusCode).toBe(400);
      expect(response2.statusCode).toBe(400);
      expect(response3.statusCode).toBe(400);
      expect(response4.statusCode).toBe(400);
    });
    test("should return status 404 if there is a user with such email already", async () => {
      const response = await request(app).post("/users/create").send(newUser);
      expect(response.statusCode).toBe(404);
    });
  });
  test("should delete a user", async () => {
    const response = await request(app).delete("/users/delete/jack");
    expect(response.statusCode).toBe(200);
  });
});
describe("Tasks actions", () => {
  test("should create a task", async () => {
    const response = await request(app)
      .post("/tasks/create")
      .send({ title: "read 10 pages of a book", user: newUser._id });
    newTask = response.body.newTask;
    expect(response.statusCode).toBe(200);
  });
  test("should delete a task", async () => {
    const response = await request(app).delete(`/tasks/delete/${newTask._id}`);
    expect(response.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await db.disconnect();
});
