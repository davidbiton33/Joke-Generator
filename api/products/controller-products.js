var express = require('express');
var router = express.Router();

const {
    getProductsDataForHomePage,
    getProductById,
    getAllProductsByCategorie,
    getCategories
} = require('./actions-products');







/* get categories data */

router.post('/get-categories', async (req, res) => {
    res.send(await getCategories(req.body));
});

/* ******************* */






/* get the products data for home page */

router.post('/get-products-for-home-page', async (req,res) => {
    res.send(await getProductsDataForHomePage(req.body));
});

/* ********************************* */






/* get products by category id */

router.post('/get-products-by-categoryId', async (req,res) => {
    res.send(await getAllProductsByCategorie(req.body.param));
});

/* ********************************* */






/* get product data by product id */

router.post('/get-product-by-productId', async (req,res) => {
    res.send(await getProductById(req.body.param));
});

/* ********************************* */














/*  מוחק מוצר לפי איידי  */

/* router.post('/delete-product-by-productId', deleteItemById);
 */
/* ********************************* */

/*  מעדכן מוצר לפי איידי  */

/* router.post('/update-product-by-productId', updateItemById);
 */
/* ********************************* */

/*  מוסיף מוצר  */

/* router.post('/add-product', saveItemInDB)
 */
/* ********************************* */





module.exports = router;


