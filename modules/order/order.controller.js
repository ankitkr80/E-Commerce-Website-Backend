const OrderSchema = require('../../models/OrderSchema');
const ProductSchema = require('../../models/ProductSchema');
const mongoose = require('mongoose');

async function createOrder(req,res) {
  try {
    console.log("check4");
    const {
      products = [],
      address
    } = req.body;
    const { user } = req;
    if(!products.length) {
      throw ({ message: 'products are missing'});
    }
    const productIds = products.map((product)=>product.productId);
    const productsCount = await ProductSchema.count({
      _id: {$in: productIds }
    });
    if(productsCount != products.length){
      throw({ message: 'Some products does not exists'});
    }
    let total = 0;
    products.forEach(product=>{
      total += product.price*product.quantity;
    });
    const order = new OrderSchema({
      products,
      address,
      userId: user._id,
      total,
      tax: total*12/100,
      shippingPrice: total*2/100,
      orderTotal: total + total*14/100 
    });
    await order.save();
    return res.status(201).json({
       message: 'Order created successfully',
       data: {
        order
       }
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Something went wrong',
      error
    });
  }
}

async function getMyOrders(req,res) {
  try{
    const { user } = req;
    console.log(user._id);
    const orders = await OrderSchema.find({
      userId: user._id
    });
    return res.status(200).json({
       message: 'Orders fetched successfully',
       data: {
        orders
       }
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong',
      error
    });
  }
}

async function getOrderDetails(req,res){
  try {
    const { id } = req.params;
    const order = await OrderSchema.findById(id);
    if(!order){
      throw ({ message: 'Invalid id'});
    };
    return res.status(200).json({
      message: 'Orders fetched successfully',
      data: {
       order
      }
   });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong',
      error
    });
  }
}

async function getAllOrders(req,res) {
  try{
    const { user } = req;
    const orders = await OrderSchema.find({});
    return res.status(200).json({
       message: 'Orders fetched successfully',
       data: {
        orders
       }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Something went wrong',
      error
    });
  }
}


//update order status
// check is order exist
// if not send error
//find current order status
//evaluate current order status with input order status like
//processing can be changed to confirm or cancel
//confirm -> packed or cancel
// packed -> out for delivery
//out for delivery -> delivered or cancel
//deliverd can not be changed
// canceled can not be changed
async function updateOrderStatus(req,res) {
  try {
    console.log("check1");
    const { id } = req.params;
    const { status } = req.body;
    const order = await OrderSchema.findById(id);
    if(!order){
      throw ({ message: 'Invalid id'});
    };
    const { status: currentStatus } = order; 
    console.log(currentStatus);
    if (currentStatus === 'delivered' || currentStatus === 'canceled') {
      throw ({ message: 'Order cannot be updated'});
    }
    console.log(currentStatus === 'processing', status != 'confirmed', status != 'canceled', status != 'confirmed' || status != 'canceled');
    if (
      (currentStatus === 'processing' && (status != 'confirmed' || status != 'canceled'))
      || (currentStatus === 'confirmed' && (status != 'out for delivery'|| status != 'canceled'))
      || (currentStatus === 'out for delivery' && (status != 'delivered'|| status != 'canceled'))
    ) {
      throw ({ message: 'Invalid order status'})
    }
    order.status = status;
    await order.save();
    return res.status(200).json({
      message: 'Orders updated successfully',
      data: {
       order
      }
   });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong',
      error
    });
  }
}


module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
}
