const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const cors = require('cors');

//logging errors to file
//const loggingFile = require("./startup/logging");

var productsRouter = require('./api/products/controller-products');
var usersRouter = require('./api/users/controller-users');
var cartsRouter = require('./api/shipingCarts/controller-carts');

const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());

//app.use(loggingFile());


// database connection

mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
},
    function (err) {
        if (err) console.log(err);
        console.log("database is connected");
    });

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/shopping-cart', cartsRouter);



app.get('/', function (req, res) {
    res.status(200).send(`Welcome`);
});

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
});