import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { productRouter } from "./routers/productRouter";
import { seedRouter } from "./routers/seedRouter";
import { userRouter } from "./routers/userRouter";
import { orderRouter } from "./routers/orderRouter";
import { keyRouter } from "./routers/keyRouter";
import { postRouter } from "./routers/postRouter";
import { uploadRouter } from "./routers/uploadRouter";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tsamazivdb";
console.log(MONGODB_URI);

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("error mongodb");
  });
const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/seed", seedRouter);
app.use("/api/keys", keyRouter);
app.use("/api/upload", uploadRouter);

// app.use("/api/files", express.static("files"));
app.use(
  "/files",
  express.static(path.join(__dirname, "../../../var/lib/data"))
);
// app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(__dirname));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
);

const PORT: number = parseInt((process.env.PORT || "4000") as string, 10);
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
