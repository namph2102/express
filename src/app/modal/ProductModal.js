const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProDuctModal = new Schema(
  {
    id: { type: Number },
    avatar: { type: String },
    name: { type: String },
    slug: { type: String },
    kind: { type: Number },
    status: { type: Boolean, default: true },
    priceOrigin: { type: Number },
    priceSale: { type: Number },
    sales: { type: Number, default: 0 },
    size: { type: String, default: "" },
    material: { type: Array, default: "" },
    des: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProDuctModal);
