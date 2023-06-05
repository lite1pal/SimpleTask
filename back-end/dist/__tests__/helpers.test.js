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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const validPassword = "Denis12345";
const invalidPassword = "denis";
let hashedPassword;
describe("Password validation", () => {
    it("should return true if password is valid", () => {
        const result = (0, helpers_1.validatePassword)(validPassword);
        expect(result).toBeTruthy();
    });
    it("should return false if password is invalid", () => {
        const result = (0, helpers_1.validatePassword)(invalidPassword);
        expect(result).toBeFalsy();
    });
});
describe("Password encryption", () => {
    it("should return hashed password", () => __awaiter(void 0, void 0, void 0, function* () {
        hashedPassword = yield (0, helpers_1.hashPassword)(validPassword);
        expect(hashedPassword).toBeTruthy();
    }));
    it("should return true if provided password equals encrypted one", () => __awaiter(void 0, void 0, void 0, function* () {
        const isPasswordTheSame = yield (0, helpers_1.comparePassword)(validPassword, hashedPassword);
        expect(isPasswordTheSame).toBeTruthy();
    }));
});
