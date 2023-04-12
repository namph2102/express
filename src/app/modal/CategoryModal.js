const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const Category = new Schema({
  id: { type: Number },
  title: { type: String },
  image: { type: String },
  createAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("categories", Category);
