var express = require('express');
var router = express.Router();

const {
    getCartByToken,
    setCartByUserToken,
    addToCart,
    updateCart,
    deleteProductFromCart
} = require('./actions-carts')




/* get shipping cart by user Token */

router.post('/get-cart', async (req, res) => {
    res.send(await getCartByToken(req.body.param));
});

/* ******************* */






/* set cart to user by user Token */

router.post('/set-cart', async (req, res) => {
    res.send(await setCartByUserToken(req.body));
});

/* ******************* */




/* add product to cart */

router.post('/add-to-cart', async (req, res) => {
    res.send(await addToCart(req.body));
});

/* ******************* */





/* update product to cart */

router.post('/update-product-in-cart', async (req, res) => {
    res.send(await updateCart(req.body));
});

/* ******************* */





/* delete product from cart */

router.post('/delete-product-from-cart', async (req, res) => {
    res.send(await deleteProductFromCart(req.body));
});

/* ******************* */



module.exports = router;
