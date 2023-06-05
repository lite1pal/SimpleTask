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
exports.comparePassword = exports.hashPassword = exports.validatePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validatePassword = (password) => {
    let is8length = false;
    let isDigit = false;
    let isCapital = false;
    is8length = password.length >= 8;
    isDigit = password.split("").some((pw) => {
        if ("0123456789".includes(pw))
            return true;
    });
    isCapital = password.split("").some((pw) => {
        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(pw))
            return true;
    });
    return is8length && isDigit && isCapital;
};
exports.validatePassword = validatePassword;
const hashPassword = (password, saltRounds = 10) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        return hashedPassword;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isPasswordTheSame = yield bcrypt_1.default.compare(password, hashedPassword);
        return isPasswordTheSame;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
});
exports.comparePassword = comparePassword;
