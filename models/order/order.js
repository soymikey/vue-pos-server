"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  basket: {
    group: [
      [
        {
          extra: [{ name: String, id: Number }],
          id: Number,
          name: String,
          nameWithSpecs: String,
          num: Number,
          price: Number,
          specs: String
        }
      ]
    ]
  },
  createdDate: String,
  orderTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  orderId: Number,
  restaurantId: { type: Number, isRequired: true },
  restaurantName: String,
  totalAmount: Number,
  totalQuantity: Number,
  userInfo: {
    userId: Number,
    userName: String
  },
  address: String,
  description: String
});

orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
