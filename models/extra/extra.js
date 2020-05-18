"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const extraCategorySchema = new Schema({
  extraCategoryId: Number,
  restaurantId: Number,
  name: String,
  description: String,
  createdDate: Date,
  extras: [
    {
      restaurantId: Number,
      extraCategoryId: Number,
      extraId: Number,
      name: String,
      description: String,
      price: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("ExtraCategory", extraCategorySchema);
