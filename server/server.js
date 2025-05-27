import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectMongoDB from "./mongodb/connect.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cityRouter from "./routes/city.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

connectMongoDB(process.env.MONGO);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET, HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  })
);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// http://localhost:3000/api/v1/users/66e572489aba57053932eebe
app.use("/api/v1/users", userRouter);
// http://localhost:3000/api/v1/listings/latest
// http://localhost:3000/api/v1/listings/latest?limit=2&type=wynajem
app.use("/api/v1/listings", listingRouter);
// http://localhost:3000/api/v1/cities/all?name=wa
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cities", cityRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
