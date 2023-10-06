import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import request from "request";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.listen(port, () => {
  console.log("listening on port", port);
});
