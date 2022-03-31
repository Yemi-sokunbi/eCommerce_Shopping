const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const error = require('../controllers/error')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.post('/add-to-cart/:id', shopController.postCart);

router.get('/products', shopController.getProducts);

router.get('/orders', shopController.getOrders);

router.get('/product/:id', shopController.getProductDetail);

router.post('/cart-delete/:id', shopController.postDeleteCartItem);

router.post('/create-order', shopController.postOrder);

router.get('/*', error.get404);

module.exports = router;
