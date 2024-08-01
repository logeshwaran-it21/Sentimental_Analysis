const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
// MONGO_URI= mongodb://localhost:27017/senti-analysis
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database..."));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", require("./endpoints/auth/authRouter"));
app.use("/api/predict", async (req, res) => {
  if (!req.cookies || !req.cookies._auth)
    return res.status(401).json({ message: "Unauthorized" });

  const token = req.cookies._auth;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const text = req.body.text;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(
        `External service responded with status ${response.status}`
      );
    }
    const json = await response.json();
    res.json(json);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../client/dist/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.listen(3000, () => console.log("Server started..."));
