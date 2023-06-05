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
exports.checkAuth = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // gets user authorization values from req.headers.authorization string
    const clientSessionId = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const clientEmail = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[2];
    // checks if there are provided values that can authorize a user
    if (!clientSessionId || !clientEmail)
        return res.status(401).json("authorization data is missing");
    // retrieves a user with such authorization values
    const user = yield usersModel_1.default.findOne({
        email: clientEmail,
        sessionId: clientSessionId,
    });
    // sets sessionId of retrieved user to serverSessionId variable
    const serverSessionId = user === null || user === void 0 ? void 0 : user.sessionId;
    // checks if there is user in database with such auth values and
    // if his sessionId is the same as the one provided via req.headers
    if (!user || serverSessionId !== clientSessionId) {
        console.log("problem here");
        console.log(user, serverSessionId, clientSessionId);
        return res.status(404).json("Authorization failed");
    }
    // gives access to resource and moves to its function
    next();
});
exports.checkAuth = checkAuth;
