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
exports.deleteUser = exports.authUserGoogle = exports.authUser = exports.createUser = exports.getSingleUser = exports.getUsers = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const tasksModel_1 = __importDefault(require("../models/tasksModel"));
const google_1 = require("../services/google");
const helpers_1 = require("../helpers/helpers");
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
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json("Some input field value is missing");
        if (!helpers_1.validatePassword)
            return res.status(400).json("Password is invalid");
        const hashedPassword = yield (0, helpers_1.hashPassword)(password);
        const existingUser = yield usersModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(404).json("User with such email is created already");
        const newUser = yield usersModel_1.default.create({
            name,
            email,
            password: hashedPassword,
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
        const isPasswordTheSame = yield (0, helpers_1.comparePassword)(password, user.password);
        if (!isPasswordTheSame)
            return res.status(401).json("Password is incorrect for this user");
        const updatedUser = yield usersModel_1.default.findOneAndUpdate({
            email,
        }, { sessionId: req.sessionID }, { new: true });
        yield (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.save());
        return res.status(200).json({
            message: "User was authorized!",
            user,
            updatedUser,
            sessionId: req.sessionID,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.authUser = authUser;
const authUserGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ message: "There is no provided token" });
        const user = yield (0, google_1.verifyJWT)(process.env.GOOGLE_CLIENT_ID, token);
        if (!user)
            return res
                .status(401)
                .json({ message: "token was not verified by google" });
        const existingUser = yield usersModel_1.default.findOne({ email: user.email });
        if (!existingUser) {
            const newUser = yield usersModel_1.default.create({
                name: user.given_name,
                email: user.email,
                password: user.sub,
                sessionId: req.sessionID,
            });
            yield newUser.save();
            const { _id, name, email, sessionId } = newUser;
            return res.status(200).json({
                message: "User was verified by Google!",
                user: { _id, name, email, sessionId },
            });
        }
        else {
            return res.status(200).json({
                message: "User was verified by Google!",
                user: {
                    name: existingUser.name,
                    email: existingUser.email,
                    sessionId: existingUser.sessionId,
                    _id: existingUser._id,
                },
            });
        }
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json("Error occured while authorizing a user via Google");
    }
});
exports.authUserGoogle = authUserGoogle;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield usersModel_1.default.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ message: "There is no user with such email" });
        // deletes all tasks of the user
        yield tasksModel_1.default.deleteMany({ user: user._id });
        // deletes the user
        const deletedUser = yield usersModel_1.default.deleteOne({ email });
        return res.status(200).json({ message: "User is deleted.", deletedUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while deleting a user");
    }
});
exports.deleteUser = deleteUser;
