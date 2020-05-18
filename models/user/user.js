"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  userId: Number,
  restaurantId: Number,
  createdDate: Date,
  auth: Number, //1:普通管理、 2:超级管理员
  avatar: { type: String, default: "default.jpg" },
  city: String,
  staffIds: [{ staffId: Number }],
  managerId: Number
});

userSchema.index({ userId: 1 });

module.exports = mongoose.model("user", userSchema);
