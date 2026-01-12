const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 60,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user', 'owner'],
      default: 'user',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);