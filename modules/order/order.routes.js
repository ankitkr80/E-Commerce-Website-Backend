const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../authentication/auth');
const { createOrder, getMyOrders, getOrderDetails, getAllOrders, updateOrderStatus } = require('./order.controller');


router.route('/').get(authenticate, getMyOrders).post(authenticate, createOrder);
router.route('/admin/').get(authenticate, authorize, getAllOrders);
router.route('/admin/:id').put(authenticate, authorize, updateOrderStatus);
router.route('/:id').get(authenticate, getOrderDetails);


module.exports = router;
