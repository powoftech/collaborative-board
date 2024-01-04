import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";
import { assertIsDefined } from "../utils/assertIsDefined";

export const getNotes: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
      assertIsDefined(authenticatedUserId);

      const notes = await NoteModel.find({
        userId: authenticatedUserId,
      }).exec();

      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  }
);

export const getNote: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    const noteId = req.params.noteId;

    try {
      assertIsDefined(authenticatedUserId);

      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, "Invalid note ID!");
      }

      const note = await NoteModel.findById(noteId).exec();

      if (!note) {
        throw createHttpError(404, "Note not found!");
      }

      if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(401, "You are not allowed to access this note!");
      }

      res.status(200).json(note);
    } catch (error) {
      next(error);
    }
  }
);

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = expressAsyncHandler(async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  const title = req.body.title;
  const text = req.body.text;

  try {
    assertIsDefined(authenticatedUserId);

    if (!title) {
      throw createHttpError(400, "Note must have a title!");
    }

    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
});

interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = expressAsyncHandler(async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID!");
    }

    if (!newTitle) {
      throw createHttpError(400, "Note must have a title!");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found!");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You are not allowed to access this note!");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
});

export const deleteNote: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    const noteId = req.params.noteId;

    try {
      assertIsDefined(authenticatedUserId);

      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, "Invalid note ID!");
      }

      const note = await NoteModel.findById(noteId).exec();

      if (!note) {
        throw createHttpError(404, "Note not found!");
      }

      if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(401, "You are not allowed to access this note!");
      }

      await note.deleteOne();

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);
