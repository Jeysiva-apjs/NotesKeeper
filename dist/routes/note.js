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
const auth_1 = __importDefault(require("../middleware/auth"));
const models_1 = require("../database/models");
const zod_1 = require("zod");
const router = express_1.default.Router();
const noteInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
router.get("/notes", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    try {
        const notes = yield models_1.Note.find({ userId });
        res.status(200).json({ notes: notes });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to retrieve notes" });
    }
}));
router.post("/new", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = noteInput.safeParse(req.body);
    const userId = req.headers["userId"];
    if (!parsedInput.success) {
        res.status(400).json({ message: parsedInput.error.issues[0].message });
        return;
    }
    const title = parsedInput.data.title;
    const description = parsedInput.data.description;
    try {
        const newNote = yield new models_1.Note({ title, description, userId });
        yield newNote.save();
        res.status(200).json({ message: "Note created sucessfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create new note" });
    }
}));
router.patch("/update/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.headers["userId"];
    const parsedInput = noteInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(400).json({ message: parsedInput.error.issues[0].message });
        return;
    }
    const title = parsedInput.data.title;
    const description = parsedInput.data.description;
    try {
        const updatedNote = yield models_1.Note.findByIdAndUpdate(id, {
            title,
            description,
            userId,
        });
        if (!updatedNote) {
            res.status(404).json({ message: "Note not found" });
            return;
        }
        else {
            res.status(200).json({ message: "Note updated successfully" });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while updating the note" });
    }
}));
router.delete("/delete/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield models_1.Note.findByIdAndDelete(req.params.id);
        if (note) {
            res.status(200).json({ message: "Note deleted sucessfully" });
        }
        else {
            res.status(400).json({ message: "Note not found" });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the note" });
    }
}));
exports.default = router;
