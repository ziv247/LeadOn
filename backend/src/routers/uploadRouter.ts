import express from "express";
import multer from "multer";
import fs from "fs";
import asyncHandler from "express-async-handler";
import { isAuth } from "../utils";
export const uploadRouter = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

uploadRouter.post("/single", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send("single file uploaded");
});

uploadRouter.post("/multiple", upload.array("files", 5), (req, res) => {
  // console.log(req.files);
  const urls = req.files?.map(file=>{
    return req.protocol + "://" + req.get('host') +'/api/'+file.path
  })
  console.log(urls);
  res.json(urls);
  // res.json("multiple file uploaded");
});

// uploadRouter.post(
//   "/multiple", upload.array("files", 5),
//   asyncHandler(async (req, res) => {
//     console.log(req.files)
//     // const createdPost = await PostModel.create({
//     //   what: req.body.what,
//     //   where: req.body.where,
//     //   when: req.body.when,
//     //   user:req.user._id
//     // });
//     res.status(201).json(req.files);
//   })
// );

// uploadRouter.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     fs.readFile("./files/1687099524775--dor.jpg", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//       res.send(data)
//     });
//     // const products = await PostModel.find();
//     // res.json(products);
//   })
// );
