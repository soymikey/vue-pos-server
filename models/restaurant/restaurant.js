"use strict";

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  managerId: Number,
  restaurantId: Number,

  address: String,

  description: { type: String, default: "" },

  location: { type: [Number], index: "2d" },

  name: {
    type: String,
    required: true
  },
  opening_hours: { type: Array, default: ["08:30/20:30"] },
  phone: {
    type: String,
    required: true
  },

  promotion_info: {
    type: String,
    default: "欢迎光临，用餐高峰请提前下单，谢谢"
  }
});

restaurantSchema.index({ restaurantId: 1 }); //primary_key 主键

module.exports = mongoose.model("Restaurant", restaurantSchema);
