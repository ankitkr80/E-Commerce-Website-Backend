const mongoose = require('mongoose');

function connectDatabase(){
  mongoose.connect('mongodb://127.0.0.1:27017/ecom')
    .then(()=>{
      console.log('connected to database');
    })
    .catch((err)=>{
      console.log('Failed to connect to database', err);
    })
}

module.exports = {
  connectDatabase
}
