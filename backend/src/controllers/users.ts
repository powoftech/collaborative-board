import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import UserModel from "../models/user";

export const getAuthenticatedUser: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.session.userId)
        .select("+email")
        .exec();
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> =
  expressAsyncHandler(async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
      if (!username || !email || !passwordRaw) {
        throw createHttpError(400, "Missing fields!");
      }

      const existingUsername = await UserModel.findOne({
        username: username,
      }).exec();
      if (existingUsername) {
        throw createHttpError(
          409,
          "Username already existed! Please choose a different one or sign in instead."
        );
      }

      const existingEmail = await UserModel.findOne({ email: email }).exec();
      if (existingEmail) {
        throw createHttpError(
          409,
          "A user with this email address already existed! Please sign in instead."
        );
      }

      const passwordHashed = await bcrypt.hash(passwordRaw, 10);

      const newUser = await UserModel.create({
        username: username,
        email: email,
        password: passwordHashed,
      });

      req.session.userId = newUser._id;

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  });

interface SignInBody {
  username?: string;
  password?: string;
}

export const signIn: RequestHandler<unknown, unknown, SignInBody, unknown> =
  expressAsyncHandler(async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
      if (!username || !password) {
        throw createHttpError(400, "Missing fields!");
      }

      const user = await UserModel.findOne({ username: username })
        .select("+password +email")
        .exec();

      if (!user) {
        throw createHttpError(401, "Incorrect username or password!");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw createHttpError(401, "Incorrect username or password!");
      }

      req.session.userId = user._id;
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

export const signOut: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ message: "User signed out successfully!" });
      }
    });
  }
);
