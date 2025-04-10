import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {} from 'dotenv/config';
import cookieParser from "cookie-parser";
import AuthRoute from "./Routes/AuthRoute.js";

const { MONGO_URI, PORT, FRONT_PORT } = process.env;
const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: [`http://localhost:${FRONT_PORT}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use(cookieParser());

app.use(express.json());

app.use("/", AuthRoute)