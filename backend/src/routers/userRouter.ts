import asyncHandler from "express-async-handler";
import express, { Request, Response } from "express";
import { User, UserModel } from "../models/userModel";
import { generateToken } from "../utils";

export const userRouter = express.Router();

userRouter.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({
      "facebookData.fb_userID": req.body.facebookData.fb_userID,
    });

    console.log("user");
    console.log(user);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        facebookData: user.facebookData,
        token: generateToken(user),
      });
      return;
    }
    res.status(401).json({ message: "Invalid email or password" });
  })
);
userRouter.post(
  "/updateFb",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      { facebookData: req.body.facebookData }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      tel: req.body.tel,
      facebookData: req.body.facebookData,
    } as User);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      tel: user.tel,
      facebookData: user.facebookData,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);
