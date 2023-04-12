require("dotenv").config();
const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(process.env.HOSTNAME);
  } catch (err) {
    console.log("conntect error");
  }
}

module.exports = { connectDB };
