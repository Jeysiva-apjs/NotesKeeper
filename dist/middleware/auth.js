"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const SECRET = process.env.SECRET || "";
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "Unothorised" });
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.send(403).json({ message: err.message });
        }
        if (!payload || typeof payload == "string") {
            return res.sendStatus(403);
        }
        req.headers["userId"] = payload.id;
        next();
    });
};
exports.default = authenticateJwt;
