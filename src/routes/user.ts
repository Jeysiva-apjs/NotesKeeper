import express from "express";
import { User } from "../database/models";
import { Note } from "../database/models";
import mongoose from "mongoose";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import authenticateJwt from "../middleware/auth";
import "dotenv/config";
import { z } from "zod";

const SECRET = process.env.SECRET || "";
const router = express.Router();

const signupInput = z.object({
  userName: z.string().min(3).max(50),
  password: z.string().min(8).max(50),
});

router.post("/signup", async (req, res) => {
  const parsedInput = signupInput.safeParse(req.body);

  if (!parsedInput.success) {
    res.status(411).json({ message: parsedInput.error });
    return;
  }
  const userName = parsedInput.data.userName;
  const password = parsedInput.data.password;

  const user = await User.findOne({ userName: userName });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ userName, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1hr" });
    res
      .status(200)
      .send({ message: "User created successfully", token: token });
  }
});

router.post("/login", async (req, res) => {
  const parsedInput = signupInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res
      .status(411)
      .json({ message: parsedInput.error.issues[0].message });
  }

  const userName = parsedInput.data.userName;
  const password = parsedInput.data.password;

  const user = await User.findOne({ userName, password });
  if (!user) {
    res.status(401).json({ message: "Invalid user name or password" });
    return;
  }

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1hr" });
  res.status(200).json({ message: "Logged in sucessfully", token: token });
});

router.get("/me", authenticateJwt, async (req, res) => {
  const userId = req.headers["userId"];
  const user = await User.findById(userId);

  if (user) {
    res.status(200).json({ message: user.userName });
  } else {
    res.status(400).json({ message: "User does not exists" });
  }
});

export default router;
