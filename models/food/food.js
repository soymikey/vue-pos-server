"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  restaurantId: { type: Number, isRequired: true },
  categoryId: { type: Number, isRequired: true },
  foodId: { type: Number, isRequired: true },
  name: { type: String, isRequired: true },
  description: String,
  createdDate: Date,
  specfoods: [
    {
      foodName: { type: String, isRequired: true },
      specsId: { type: Number, isRequired: true },
      price: { type: Number, default: 0 },
      specsName: String
    }
  ]
});

foodSchema.index({ foodId: 1 });

module.exports = mongoose.model("Food", foodSchema);
