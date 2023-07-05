import asyncHandler from "express-async-handler";
import express, { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import {  sampleProducts, sampleUsers } from "../data";
import { UserModel } from "../models/userModel";
import { PostModel } from "../models/postModel";
export const seedRouter = express.Router();

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProducts);

    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);

    await PostModel.deleteMany({});
    // const createdPosts = await PostModel.insertMany(samplePosts);

    res.json({ createdProducts, createdUsers });
  })
);
