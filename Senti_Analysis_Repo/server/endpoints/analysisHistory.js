const express = require("express");
const jwt = require("jsonwebtoken");
const History = require("../model/history"); // Make sure the History model is defined correctly
const router = express.Router();

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const token = req.cookies._auth; // Check for token in cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = { id: decoded.id }; // Attach user ID from token to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Save analysis history function
const saveAnalysisHistory = async (req, res) => {
  const userId = req.user.id; // Get userId from the token set in authenticateToken
  const { text, sentiment } = req.body;

  console.log("Saving analysis history:", { userId, text, sentiment }); // Log the data

  const history = new History({
    userId: userId,
    text: text,
    sentiment: sentiment,
  });

  try {
    await history.save(); // Save the history to MongoDB
    res.status(201).send({ message: "Analysis history saved successfully." });
  } catch (error) {
    console.error("Error saving analysis history:", error); // Log the error
    res.status(500).send({ error: "Error saving analysis history" });
  }
};

// Define the route and apply authentication middleware
router.post("/save", authenticateToken, saveAnalysisHistory);

module.exports = router;
