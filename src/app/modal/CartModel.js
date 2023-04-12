const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    products: [
      {
        id: { type: Schema.Types.ObjectId, ref: "products" },
        amount: { type: Number, default: 1 },
        priceSale: { type: Number, required: true },
      },
    ],
    status: { type: String, default: "xác nhận" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("carts", cartModel);
