// // server/model/history.js
// const mongoose = require("mongoose");

// const historySchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   sentiment: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("History", historySchema);

const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you're using MongoDB ObjectId for users
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Optional: timestamps to track when history was saved

module.exports = mongoose.model("History", historySchema);
