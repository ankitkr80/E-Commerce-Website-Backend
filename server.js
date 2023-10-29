const express= require('express');
const app = express();
const { connectDatabase } = require('./database/conect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

connectDatabase();

app.use(bodyParser.json());
app.use(cookieParser())
// routes
const productRoutes = require('./modules/product/product.routes');
const userRoutes = require('./modules/user/user.routes');
const orderRoutes = require('./modules/order/order.routes');

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);



app.listen(3000, ()=>{
  console.log('server is running on port', 3000);
})
