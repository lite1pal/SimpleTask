"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// global variables
let db;
let newUser;
let newTask;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const ATLAS_URI = process.env.ATLAS_URI || "";
    db = yield mongoose_1.default.connect(ATLAS_URI);
}));
describe("User actions", () => {
    describe("createUser", () => {
        test("should create a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).post("/users/create").send({
                name: "jack",
                email: "jack@gmail.com",
                password: "jack",
            });
            newUser = response.body.newUser;
            expect(response.statusCode).toBe(200);
        }));
        test("should return status 400 if some of input field value is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response1 = yield (0, supertest_1.default)(app_1.app)
                .post("/users/create")
                .send({ name: "", email: "jack@gmail.com", password: "jack" });
            const response2 = yield (0, supertest_1.default)(app_1.app).post("/users/create").send({
                name: "jack",
                email: "",
                password: "jack",
            });
            const response3 = yield (0, supertest_1.default)(app_1.app).post("/users/create").send({
                name: "jack",
                email: "jack@gmail.com",
                password: "",
            });
            expect(response1.statusCode).toBe(400);
            expect(response2.statusCode).toBe(400);
            expect(response3.statusCode).toBe(400);
        }));
        test("should return status 404 if there is a user with such email already", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).post("/users/create").send(newUser);
            expect(response.statusCode).toBe(404);
        }));
    });
    describe("authUser", () => {
        test("should authorize a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post("/users/auth")
                .send({ email: "jack@gmail.com", password: "jack" });
            newUser = response.body.updatedUser;
            expect(response.statusCode).toBe(200);
        }));
    });
    test("should retrieve users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .get("/users")
            .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
        expect(response.statusCode).toBe(200);
    }));
    test("should delete a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .delete("/users/delete/jack@gmail.com")
            .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
        expect(response.statusCode).toBe(200);
    }));
});
describe("Tasks actions", () => {
    test("should create a task", () => __awaiter(void 0, void 0, void 0, function* () {
        const responseUser = yield (0, supertest_1.default)(app_1.app).post("/users/create").send({
            name: "jack",
            email: "jack@gmail.com",
            password: "jack",
        });
        newUser = responseUser.body.newUser;
        const response = yield (0, supertest_1.default)(app_1.app)
            .post("/tasks/create")
            .send({ title: "read 10 pages of a book", user_id: newUser._id })
            .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
        newTask = response.body.newTask;
        expect(response.statusCode).toBe(200);
    }));
    test("should delete a task", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .delete(`/tasks/delete/${newTask._id}`)
            .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
        expect(response.statusCode).toBe(200);
        yield (0, supertest_1.default)(app_1.app)
            .delete("/users/delete/jack@gmail.com")
            .set("Authorization", `Bearer ${newUser.sessionId} ${newUser.email}`);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.disconnect();
}));
