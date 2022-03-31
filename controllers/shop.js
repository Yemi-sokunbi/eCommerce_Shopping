const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(product =>{
      res.render('shop/product-list', {
        prods: product,
        pageTitle: 'Shop',
        path: '/products'
        });
    })
    
};

exports.getIndex = (req,res, next) => {
  Product.findAll()
    .then(products =>{
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
        });
    })
    .catch((err) => {

    })
}

exports.getProductDetail = (req, res, next) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Product Details',
        path: '/product-detail'
      })
    })
  
    
}
exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products=> {
      res.render('shop/cart',
            {path: '/cart',
            pageTitle: 'MyCart', 
            carts: products
          });
    })
  })
};

exports.postCart = (req,res,next) => {
  let newQuantity =1
  let fetchedCart
  const id = req.params.id;
  //get cart associated with user
  req.user.getCart()
  //get products in cart with id of new product
  .then(cart =>{
    fetchedCart =cart
    return cart.getProducts({where: {id: id}});
  })
  .then(products => {
      let product
      if (products.length > 0){ //Product exists
        product = products[0];
      }
    
    //If product exist, increase quatity
    if (product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
      //  return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
    }
    //If !product, find product 
    return Product.findByPk(id)
      // .then(product => {
      //   return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
      // })
  })
  .then(product => {
    return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});

  })
  .then(() => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user.getCart()
  .then(cart =>{
    fetchedCart = cart;
    return cart.getProducts()
  })
  .then(products =>{
    return req.user
    .createOrder()
    .then(order => {
      
      return order.addProducts(products.map(product => {
        product.orderItem = { quantity:  product.cartItem.quantity};
        return product;
      }))
    })
    .catch(err => console.log(err))
  })
  .then(result => {
    //clear cart
    return fetchedCart.setProducts(null);
  })
  .then(result =>{
    res.redirect('/get-orders');
  })
}

exports.getOrders = (req, res, next) => {
  req.user
  .getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders',
    {path: '/checkout',
    pageTitle: 'Checkout',
    orders: orders
    })
  })
  .catch(err => console.log(err))  
}

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.params.id;
  req.user.getCart()
  .then(cart =>{
    return cart.getProducts({where: {id: id}})
  })
  .then(products =>{
    product = products[0];
    return product.cartItem.destroy()
  })
  .then(result =>{
    res.redirect('/cart')
  })
}


