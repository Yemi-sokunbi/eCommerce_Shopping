const path = require('path');
const sequelize = require('./util/databaseSQL')

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user =>{
        req.user = user;
        next()
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Define relations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem}); //Connection stored in CartItem
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem}); 

//Syn model to database, creates appropriate db table or relations
sequelize
    //.sync({force: true}) //override any existing table
    .sync() //override any existing table
    .then(result => {
        return User.findByPk(1)
    })
    
    .then(user => {
        if(!user){
            User.create({
                name: 'Jame',
                email: 'test.com'
            })
        }
        return user
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(7000)
    })
    .catch(err => {
        console.log(err)
    })



