import express from "express";
import asyncHandler from "express-async-handler";
import { PostModel } from "../models/postModel";
export const postRouter = express.Router();
import { isAuth } from "../utils";

postRouter.get(
  "/mine",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const posts = await PostModel.find({ user: req.user._id });
    res.json(posts);
  })
);

postRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await PostModel.find().populate('user').exec();
    console.log(products)
    res.json(products);
  })
);

postRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const post = await PostModel.findOne({ _id: req.params.id });
    console.log(post);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  })
);

postRouter.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log(req.user)
    const createdPost = await PostModel.create({
      what: req.body.what,
      where: req.body.where,
      when: req.body.when,
      user:  req.user._id,  
      isPending: true,
    });
    res.status(201).json({ message: "Post Created", post: createdPost });
  })
);

postRouter.post(
  "/update",
  asyncHandler(async (req, res) => {
    console.log(req.params.id, req.body.isPending);
    const post = await PostModel.findOneAndUpdate(
      { _id: req.body._id },
      { isPending: req.body.isPending }
    );
    console.log(post);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  })
);
