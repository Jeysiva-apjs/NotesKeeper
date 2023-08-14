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
const express_1 = __importDefault(require("express"));
const models_1 = require("../database/models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
require("dotenv/config");
const zod_1 = require("zod");
const SECRET = process.env.SECRET || "";
const router = express_1.default.Router();
const signupInput = zod_1.z.object({
    userName: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(8).max(50),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({ message: parsedInput.error });
        return;
    }
    const userName = parsedInput.data.userName;
    const password = parsedInput.data.password;
    const user = yield models_1.User.findOne({ userName: userName });
    if (user) {
        res.status(403).json({ message: "User already exists" });
    }
    else {
        const newUser = new models_1.User({ userName, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, SECRET, { expiresIn: "1hr" });
        res
            .status(200)
            .send({ message: "User created successfully", token: token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res
            .status(411)
            .json({ message: parsedInput.error.issues[0].message });
    }
    const userName = parsedInput.data.userName;
    const password = parsedInput.data.password;
    const user = yield models_1.User.findOne({ userName, password });
    if (!user) {
        res.status(401).json({ message: "Invalid user name or password" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET, { expiresIn: "1hr" });
    res.status(200).json({ message: "Logged in sucessfully", token: token });
}));
router.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const user = yield models_1.User.findById(userId);
    if (user) {
        res.status(200).json({ message: user.userName });
    }
    else {
        res.status(400).json({ message: "User does not exists" });
    }
}));
exports.default = router;
