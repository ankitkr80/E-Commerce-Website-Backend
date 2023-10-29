const express = require('express');
const router = express.Router();
const { getProducts, getProductDetail, createNewProduct, updateProduct, deleteProduct } = require('./product.controller');
const { authenticate, authorize } = require('../../authentication/auth');


router.route('/').get(getProducts);
router.route('/:id').get(getProductDetail);
router.route('/admin').post(authenticate, authorize, createNewProduct);
router.route('/admin/:id').put(authenticate, authorize,updateProduct).delete(authenticate, authorize, deleteProduct);


module.exports = router;
