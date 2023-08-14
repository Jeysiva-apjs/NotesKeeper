import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
});

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

export { User, Note };
