const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  address: {
    line1: {
      type: String,
      required: true,
    },
    line2:{
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    }
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Products'
      },
      quantity:{
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Users'
  },
  total:{
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  }
})
