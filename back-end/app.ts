import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.status(200).json("Setting up Typescript with Express");
});

export { app };
