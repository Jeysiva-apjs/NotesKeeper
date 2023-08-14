import express from "express";
import authenticateJwt from "../middleware/auth";
import { Note } from "../database/models";
import { z } from "zod";

const router = express.Router();

const noteInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

router.get("/notes", authenticateJwt, async (req, res) => {
  const userId = req.headers["userId"];
  try {
    const notes = await Note.find({ userId });
    res.status(200).json({ notes: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve notes" });
  }
});

router.post("/new", authenticateJwt, async (req, res) => {
  const parsedInput = noteInput.safeParse(req.body);
  const userId = req.headers["userId"];

  if (!parsedInput.success) {
    res.status(400).json({ message: parsedInput.error.issues[0].message });
    return;
  }

  const title = parsedInput.data.title;
  const description = parsedInput.data.description;

  try {
    const newNote = await new Note({ title, description, userId });
    await newNote.save();
    res.status(200).json({ message: "Note created sucessfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create new note" });
  }
});

router.patch("/update/:id", authenticateJwt, async (req, res) => {
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
    const updatedNote = await Note.findByIdAndUpdate(id, {
      title,
      description,
      userId,
    });
    if (!updatedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    } else {
      res.status(200).json({ message: "Note updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the note" });
  }
});

router.delete("/delete/:id", authenticateJwt, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (note) {
      res.status(200).json({ message: "Note deleted sucessfully" });
    } else {
      res.status(400).json({ message: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the note" });
  }
});

export default router;
