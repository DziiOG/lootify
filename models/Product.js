const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    descriptionOfProduct: {
        type: String,
        required: true
    },
    company: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    outOfStock: {
        type: Boolean,
        required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
