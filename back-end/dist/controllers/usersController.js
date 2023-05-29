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
exports.deleteUser = exports.checkAuth = exports.authUser = exports.createUser = exports.getSingleUser = exports.getUsers = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersModel_1.default.find({});
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.getUsers = getUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const user = yield usersModel_1.default.findOne({ name });
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.getSingleUser = getSingleUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // gets name, email, password and age values from the request body
        const { name, email, password, age } = req.body;
        if (!name || !email || !password || !age)
            return res.status(400).json("Some input field value is missing");
        const existingUser = yield usersModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(404).json("User with such email is created already");
        const newUser = yield usersModel_1.default.create({
            name,
            email,
            password,
            age,
            sessionId: "pending",
        });
        yield newUser.save();
        return res.status(200).json({ message: "User was created!", newUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.createUser = createUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json("Some input field value is missing");
        const user = yield usersModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json("There is no user with such email");
        const updatedUser = yield usersModel_1.default.findOneAndUpdate({
            email,
        }, { sessionId: req.sessionID }, { new: true });
        yield (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.save());
        return res.status(200).json({
            message: "User was authorized!",
            user,
            sessionId: req.sessionID,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.authUser = authUser;
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const clientSessionId = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const clientEmail = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[2];
    if (!clientSessionId || !clientEmail)
        return res.status(401).json("authorization data is missing");
    const user = yield usersModel_1.default.findOne({
        email: clientEmail,
        sessionId: clientSessionId,
    });
    const serverSessionId = user === null || user === void 0 ? void 0 : user.sessionId;
    if (!user || serverSessionId !== clientSessionId)
        return res.status(404).json("Authorization failed");
    next();
});
exports.checkAuth = checkAuth;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const deletedUser = yield usersModel_1.default.deleteOne({ name });
        return res.status(200).json({ message: "User is deleted.", deletedUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while deleting a user");
    }
});
exports.deleteUser = deleteUser;
