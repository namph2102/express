const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const userModal = new Shema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  fullname: { type: String, default: null },
  phone: { type: Number, default: null },
  address: { type: String, default: null },
  permission: { type: String, default: "member" },
  password: { type: String, default: null },
  accessToken: { type: String, default: null },
});
module.exports = mongoose.model("users", userModal);
