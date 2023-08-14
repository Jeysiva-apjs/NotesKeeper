"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: String,
    password: String,
});
const noteSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    userId: String,
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Note = mongoose_1.default.model("Note", noteSchema);
exports.Note = Note;
