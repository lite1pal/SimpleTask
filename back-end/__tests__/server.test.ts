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
  age: number;
}

interface Task {
  title: string;
  user: string;
}

// global variables
let db: typeof mongoose;
let testUser: User = {
  _id: "",
  name: "Geralt",
  email: "geralt@gmail.com",
  password: "geralt",
  age: 97,
};
let testTask: Task | undefined;

describe("User actions", () => {
  beforeAll(async () => {
    const ATLAS_URI = process.env.ATLAS_URI || "";
    db = await mongoose.connect(ATLAS_URI);
  });
  test("should create a user", async () => {
    const response = await request(app).post("/users/create").send(testUser);
    testUser = response.body.newUser;
    expect(response.statusCode).toBe(200);
  });
  describe("Tasks actions", () => {
    test("should retrieve users", async () => {
      const response = await request(app).get("/tasks");
      expect(response.statusCode).toBe(200);
    });
    test("should create a task", async () => {
      testTask = { title: "read 10 pages of a book", user: testUser._id };
      const response = await request(app).post("/tasks/create").send(testTask);
      testTask = response.body.newTask;
      expect(response.statusCode).toBe(200);
    });
    test("should delete a task", async () => {
      const response = await request(app)
        .delete("/tasks/delete")
        .send(testTask);
      expect(response.statusCode).toBe(200);
    });
  });
  test("should delete a user", async () => {
    const response = await request(app).delete("/users/delete/Geralt");
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await db.disconnect();
  });
});
