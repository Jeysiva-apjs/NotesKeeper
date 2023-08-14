import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import noteRouter from "./routes/note";

const app = express();
app.use(express.json());
app.use(cors());

const DB_URL = process.env.DB_URL || "";
const port = process.env.PORT;

app.use("/user", userRouter);
app.use("/note", noteRouter);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log(`Server is running on the port ${port}`);
    });
  })
  .catch((err) => console.log(err));
