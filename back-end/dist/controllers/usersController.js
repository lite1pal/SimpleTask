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
exports.createUser = exports.getUsers = void 0;
const usersModel_1 = require("../models/usersModel");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersModel_1.User.find({});
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new usersModel_1.User({
            name: "Denis",
            email: "deniskatasenko6@gmail.com",
            password: "Denis12345",
            age: 15,
        });
        yield newUser.save();
        return res.status(200).json(newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.createUser = createUser;
