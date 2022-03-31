const Product = require("../models/product")


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false
    });
  };
  
  exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
      title: title,
      price:price,
      imageUrl: imageUrl,
      description: description
    })
    .then(
      res.redirect('/')
    )
  };

  exports.getProducts = (req,res, next) => {
    req.user.getProducts()
    .then(product=>{ 
      res.render('admin/products', {
      prods: product,
      pageTitle: 'All Products',
      path: '/admin/products'
      });
    });
  }

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const id = req.params.id;
    req.user.getProducts({where: {id: id}})
    .then(product =>{
      if(!editMode){
        res.redirect('/')
      }
      if (!product){
        res.redirect('/')
      }
      res.render('admin/edit-product', {
      product: product[0],
      pageTitle: 'Edit Product',
      path: 'admin/edit-product',
      editing: editMode
      })
    })
    .catch(err => console.log(err))
  } 

  exports.postEditProduct = (req, res, next) => {
    const id = req.params.id;
    const _title = req.body.title;
    const _imageUrl = req.body.imageUrl;
    const _price = req.body.price;
    const _description = req.body.description;
    console.log(_title);
    Product.findByPk(id)
    .then(product => {
      product.title = _title;
      product.imageUrl = _imageUrl;
      product.price = _price;
      product.description = _description;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
  }

  exports.postDeleteProduct = (req, res, next) => {
    id = req.params.id;
    Product.findByPk(id)
    .then(product => {
      return product.destroy();
      
    })
    .then(result => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
  }