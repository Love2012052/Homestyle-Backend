const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for the item!"],
  },
  category: {
    type: String,
    required: [true, "Please enter a category for the item!"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the price of the item!"],
  },
  status: {
    type: String,
    required: [true, "Please specify the status of the item!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the item!"],
  },
  imageUrl: {
    type: String,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
