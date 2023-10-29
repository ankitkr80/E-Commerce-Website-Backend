const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'product name is required'],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Users'
      },
      comment:{
        type: String,
      required: false,
      },
      rating: {
        type: String,
        required: true,
        min:[0, 'rating cannot be less then zero'],
        max: [5, 'rating cannot greater than 5']
      }
    }
  ],
  rating: {
    type: Number,
    required: true,
    default: 0,
    min:[0, 'rating cannot be less then zero'],
    max: [5, 'rating cannot greater than 5']
  },
  // createdBy: {
  //   type: mongoose.Schema.ObjectId,
  //   required: true,
  //   ref: 'Users'
  // }
});

module.exports = mongoose.model('Products', productSchema);


