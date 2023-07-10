import path  from 'path';
import express from "express";
import multer from "multer";

export const uploadRouter = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, './files');
    cb(null, path.join(__dirname, '../../../../var/lib/data'));
    // cb(null, path.join(__dirname, '../../public/files'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

uploadRouter.post("/single", upload.single("file"), (req, res) => {
  res.send("single file uploaded");
});

uploadRouter.post("/multiple", upload.array("files", 5), (req, res) => {
 
  const files= req.files as Express.Multer.File[];
 
  const urls = files.map((file) => {
    const path = (file as unknown as FileWithPath).path.replace(/\\/g, "/");
    console.log(path)

    return req.protocol + "://" + req.get("host") + "/files/" + file.filename;
  });
  res.json(urls);
});


interface FileWithPath extends File {
  path: string;
}
