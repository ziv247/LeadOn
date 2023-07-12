import express from "express";
import asyncHandler from "express-async-handler";
import { PostModel } from "../models/postModel";
import { isAuth } from "../utils";
import fs from "fs";
import path from "path";

export const postRouter = express.Router();

postRouter.get(
  "/mine",
  isAuth,
  asyncHandler(async (req, res) => {
    const posts = await PostModel.find({ user: req.user._id })
      .populate("user")
      .exec();
    res.json(posts);
  })
);

postRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await PostModel.find().populate("user").exec();
    res.json(products);
  })
);

postRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findOne({ _id: req.params.id });
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
  asyncHandler(async (req, res) => {
    const createdPost = await PostModel.create({
      what: req.body.what,
      where: req.body.where,
      when: req.body.when,
      user: req.user._id,
      isPending: true,
      isActive: false,
      notes: [],
    });
    res.status(201).json({ message: "Post Created", post: createdPost });
  })
);

postRouter.post(
  "/update",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findOneAndUpdate(
      { _id: req.body._id },
      req.body
    );
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  })
);

postRouter.post(
  "/delete",
  asyncHandler(async (req, res) => {
    const post = await PostModel.findOneAndDelete({ _id: req.body._id });

    if (post) {
      post.what.files.map((file) => {
        const fileName = file.split("http://leadon.onrender.com/files/")[1];
        // const fileName = file.split("http://localhost:4000/files/")[1];
        const oldPath = path.join(
          __dirname,
          `../../../../../../../var/lib/data/` + fileName
        );

        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            res.status(200).send(post);
          });
        }
      });

      // res.json(post);
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  })
);
