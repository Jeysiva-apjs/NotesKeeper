"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const note_1 = __importDefault(require("./routes/note"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const DB_URL = process.env.DB_URL || "";
const port = process.env.PORT;
app.use("/user", user_1.default);
app.use("/note", note_1.default);
mongoose_1.default
    .connect(DB_URL)
    .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => {
        console.log(`Server is running on the port ${port}`);
    });
})
    .catch((err) => console.log(err));
