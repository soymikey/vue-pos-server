"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryId: Number,
  restaurantId: Number,
  name: String,
  description: String,
  createdDate: Date,
  foods: [
    {
      restaurantId: Number,
      categoryId: Number,
      foodId: Number,
      name: String,
      description: String,
      specfoods: [
        { foodName: String, specsId: Number, price: Number, specsName: String }
      ]
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);
