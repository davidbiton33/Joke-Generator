const cartModel = require('../models/cart');
const User = require('../models/user');
const productModel = require('../models/product');
const log = require("../../global/console");
const { updateOne } = require('../models/cart');
const product = require('../models/product');







// get specific cart by Token \\

exports.getCartByToken = (userToken) => {

    return new Promise((resolve, reject) => {

        log.msg("Api request: get cart by user Token");

        // get cart id from user
        User.findOne({ "Token": userToken }, "CartID", async (err, cartId) => {

            // if get an error
            if (err) {
                log.error("error in find cart id by user token in DB, Error: " + err.message);

                return resolve({
                    success: false,
                    type: 1,
                    message: "error in find cart by user token in DB "
                })
            };

            // if cartId not founded
            if (!cartId) {
                log.info("not found cart by user token in DB");

                return resolve({
                    success: false,
                    type: 2,
                    message: "not found cart by user token in DB "
                })
            }

            log.info("succes to get cart id");

            cartModel.findOne({ "_id": cartId._doc.CartID }, async (err, cartData) => {

                // if get an error
                if (err) {
                    log.error("error in find cart by Id in DB, Error: " + err.message);

                    return resolve({
                        success: false,
                        type: 3,
                        message: "error in find cart by Id in DB " + err.message
                    })
                };

                // if cart not founded
                if (!cartData) {
                    log.info("not found cart for this user in DB");

                    return resolve({
                        success: false,
                        type: 4,
                        message: "not found cart for this user in DB "
                    })
                }


                log.info("succes to get cart data");

                var ids = [];

                for (var product of cartData._doc.products)
                    ids.push(product._doc.ProductId);


                productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                    if (err) {
                        log.error("error in find cart by Id in DB, Error: " + err.message);

                        return resolve({
                            success: false,
                            type: 5,
                            message: "error in find cart by Id in DB " + err.message
                        })
                    }

                    // add the quantity for every product and price
                    for (let i = 0; i < cart.length; i++) {
                        cart[i]._doc['Price'] = cart[i].PriceForCustomer
                        for (let j = 0; j < cartData.products.length; j++) {
                            if (cart[i].id == cartData.products[j].ProductId) {
                                cart[i]._doc['Quantity'] = cartData.products[j].Quantity
                                break;
                            }
                        }
                    }

                    log.info("success to get cart products");

                    return resolve({
                        success: true,
                        message: "success to get cart products",
                        cart: cart
                    });

                }).where('_id').in(ids).exec();
            }).catch((err) => {
                log.error("Failed in finding cart in DB, Error: " + err.message);
                return reject({ success: false, type: 6, message: "Failed in finding cart in DB, Error: " + err.message });
            });
        }).catch((err) => {
            log.error("Failed in finding cart by user token in DB, Error: " + err.message);
            return reject({ success: false, type: 7, message: "Failed in finding cart by user token in DB, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in get cart request, Error: " + err.message);
        return reject({ success: false, type: 8, message: "Failed in get cart request, Error: " + err.message });
    });
}

// ************ \\





// add product to cart of user \\

exports.addToCart = (dataToAdd) => {
    return new Promise((resolve, reject) => {

        log.msg("Api Request : add product to cart");

        // get the user cart by his token
        User.findOne({ Token: dataToAdd.Token }, async (err, user) => {

            // if user not founded
            if (user == null) {
                log.info("user not founded by token");
                return resolve({
                    success: false, type: 3, message: "not found user by token"
                })
            }

            log.info("user founded by token");


            // in case user dont have a cart, create new one
            if (user.CartID == null) {

                log.info("user dont have a cart");


                // create new cart
                var newCart = new cartModel();
                newCart.save(function (err, cartNew) {

                    if (err) {
                        log.error("failed to create new cart to the user");
                        return reject({ success: false, type: 12, message: "failed to create new cart to the user, Error: " + err.message });
                    }

                    log.msg("create new cart to user");

                    // update the cart id inside the user in DB
                    User.findOneAndUpdate({ Token: dataToAdd.Token }, { CartID: cartNew._id }, { new: true }, async (err, userWithCart) => {

                        if (err) {
                            log.error("failed to update cartId to user");
                            return resolve({
                                success: false,
                                type: 18,
                                message: "failed to update cartId to user, Error: " + err.message
                            });
                        }
                    });

                    productModel.findOne({ _id: dataToAdd.ProductId }, async (err, productOnList) => {

                        // if not fonded product id in DB products
                        if (!productOnList) {
                            log.error("not founded product with passen id");
                            return resolve({ success: false, type: 17, message: "not founded product with passen id" })
                        }

                        log.info("update the cart in user DB");

                        var updateData = {
                            ProductId: dataToAdd.ProductId,
                            Quantity: dataToAdd.Quantity
                        }

                        // update the product id inside the cart
                        cartModel.findOneAndUpdate({ _id: cartNew._id }, { products: updateData }, { new: true }, async (err, cartUpdated) => {


                            // array of products Ids
                            var ids = [];

                            for (var product of cartUpdated._doc.products)
                                ids.push(product._doc.ProductId);


                            // find the products by id and return the data of the products
                            productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                                // if not found products in DB by givven ids
                                if (cart == null) {
                                    log.error("products not founded by ids");
                                    return resolve({
                                        success: false, type: 16, message: "products not founded by ids"
                                    })
                                }

                                // add the quantity for every product and price
                                for (let i = 0; i < cart.length; i++) {
                                    cart[i]._doc['Price'] = cart[i].PriceForCustomer
                                    for (let j = 0; j < cartUpdated.products.length; j++) {
                                        if (cart[i].id == cartUpdated.products[j].ProductId) {
                                            cart[i]._doc['Quantity'] = cartUpdated.products[j].Quantity
                                            break;
                                        }
                                    }
                                }

                                log.msg("success to update and return the data of the product");

                                return resolve({
                                    success: true,
                                    message: "success to update and return the data of the product",
                                    cart: cart
                                });

                            }).where('_id').in(ids).exec((err) => {
                                if (err) {
                                    log.error("failed to find products by givven id");
                                    return reject({ success: false, type: 15, message: "failed to find products by givven id, Error: " + err.message });
                                }
                            })
                        }).catch((err) => {
                            log.error("failed to update the product id inside the cart");
                            return reject({ success: false, type: 14, message: "failed to update the product id inside the cart, Error: " + err.message });
                        })

                    }).catch((err) => {
                        log.error("error in check if product exise in products list");
                        return reject({ success: false, type: 13, message: "error in check if product exise in products list" })
                    })
                });
            }

            // in case user have a cart
            else {

                // valid the product exist in DB
                productModel.findOne({ _id: dataToAdd.ProductId }, async (err, productOnList) => {

                    // in case product not in DB
                    if (productOnList == null) {
                        log.error("not founded product with passen id");
                        return resolve({ success: false, type: 4, message: "not founded product with passen id" })
                    }

                    log.info("user have a cart");

                    // get the cart data
                    cartModel.findOne({ _id: user.CartID }, async (err, cartData) => {

                        // in case cart not found in DB
                        if (cartData == null) {
                            log.error("not founded cart with this id");
                            return resolve({ success: false, type: 6, message: "not founded cart with this id" })
                        }

                        // check if the product allready in the cart
                        var existProduct = 0;
                        var existQuantity;
                        for (var product of cartData.products) {
                            if (product.ProductId == dataToAdd.ProductId) {
                                existProduct = 1;
                                existQuantity = product.Quantity
                            }
                        }

                        // in case its new product in cart
                        if (existProduct == 0) {

                            var updadteData = {
                                ProductId: dataToAdd.ProductId,
                                Quantity: dataToAdd.Quantity
                            }

                            log.msg("try to add the new product to the cart");

                            // update the cart with the new product
                            cartModel.findOneAndUpdate({ _id: user.CartID },
                                { $addToSet: { products: updadteData } }
                                , { new: true }, async (err, kit) => {

                                    // array of products Ids
                                    var ids = [];

                                    for (var product of kit._doc.products)
                                        ids.push(product._doc.ProductId);


                                    // find the product by id and return the data of the product
                                    productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                                        // if not found products in DB by givven ids
                                        if (cart == null) {
                                            log.error("products not founded by ids");
                                            return resolve({
                                                success: false, type: 9, message: "products not founded by ids"
                                            })
                                        }

                                        // add the quantity for every product and price
                                        for (let i = 0; i < cart.length; i++) {
                                            cart[i]._doc['Price'] = cart[i].PriceForCustomer
                                            for (let j = 0; j < kit.products.length; j++) {
                                                if (cart[i].id == kit.products[j].ProductId) {
                                                    cart[i]._doc['Quantity'] = kit.products[j].Quantity
                                                    break;
                                                }
                                            }
                                        }

                                        log.msg("success to update the new product to the exist cart");

                                        return resolve({
                                            success: true,
                                            message: "success to update the new product to the exist cart",
                                            cart: cart
                                        });

                                    }).where('_id').in(ids).exec((err) => {
                                        if (err) {
                                            log.error("failed to find products by givven id");
                                            return reject({ success: false, type: 8, message: "failed to find products by givven id, Error: " + err.message });
                                        }
                                    })
                                }).catch((err) => {
                                    log.error("failed to update the new product in cart");
                                    return reject({ success: false, type: 7, message: "failed to update the new product in cart, Error: " + err.message });
                                })
                        }

                        // in case its exist product in cart
                        if (existProduct == 1) {

                            var quantityToUpdate = +(dataToAdd.Quantity) + +(existQuantity);
                            cartModel.findOneAndUpdate({
                                _id: user.CartID,
                                'products.ProductId': dataToAdd.ProductId
                            }, { $set: { 'products.$.Quantity': quantityToUpdate } }, { new: true }, async (err, data) => {

                                // array of products Ids
                                var ids = [];

                                for (var product of data._doc.products)
                                    ids.push(product._doc.ProductId);


                                // find the product by id and return the data of the product
                                productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                                    // if not found products in DB by givven ids
                                    if (cart == null) {
                                        log.error("products not founded by ids");
                                        return resolve({
                                            success: false, type: 10, message: "products not founded by ids"
                                        })
                                    }

                                    // add the quantity for every product and price
                                    for (let i = 0; i < cart.length; i++) {
                                        cart[i]._doc['Price'] = cart[i].PriceForCustomer
                                        for (let j = 0; j < data.products.length; j++) {
                                            if (cart[i].id == data.products[j].ProductId) {
                                                cart[i]._doc['Quantity'] = data.products[j].Quantity
                                                break;
                                            }
                                        }
                                    }

                                    log.msg("success to update the quantity to the exist product");

                                    return resolve({
                                        success: true,
                                        message: "success to update the quantity to the exist product",
                                        cart: cart
                                    });

                                }).where('_id').in(ids).exec((err) => {
                                    if (err) {
                                        log.error("failed to find products by givven id");
                                        return reject({ success: false, type: 11, message: "failed to find products by givven id, Error: " + err.message });
                                    }
                                })
                            })
                        }
                    }).catch((err) => {
                        log.error("error in finding cart by id");
                        return reject({
                            success: false,
                            type: 5,
                            message: "failed in finding cart by id"
                        })
                    })
                })
            }
        }).catch((err) => {
            log.error("error in finding user by token");
            return reject({
                success: false,
                type: 2,
                message: "failed in finding user by token"
            })
        })
    }).catch((err) => {
        log.error("error in add to cart api request");
        return reject({
            success: false,
            type: 1,
            message: "failed in add to cart api request"
        })
    })
}

// ************ \\




// update product to cart of user \\

exports.updateCart = (dataToAdd) => {
    return new Promise((resolve, reject) => {

        log.msg("Api Request : update product in cart");

        // get the user cart by his token
        User.findOne({ Token: dataToAdd.Token }, async (err, user) => {

            // if user not founded
            if (user == null) {
                log.error("user not founded by token");
                return resolve({
                    success: false, type: 3, message: "not found user by token"
                })
            }

            log.info("user founded by token");

            // valid the product exist in DB
            productModel.findOne({ _id: dataToAdd.ProductId }, async (err, productOnList) => {

                // in case product not in DB
                if (productOnList == null) {
                    log.error("not founded product with passen id");
                    return resolve({ success: false, type: 4, message: "not founded product with passen id" })
                }

                log.info("user have a cart");

                // get the cart data
                cartModel.findOne({ _id: user.CartID }, async (err, cartData) => {

                    // in case cart not found in DB
                    if (cartData == null) {
                        log.error("not founded cart with this id");
                        return resolve({ success: false, type: 6, message: "not founded cart with this id" })
                    }

                    // check if the product allready in the cart
                    var existProduct = 0;
                    for (var product of cartData.products) {
                        if (product.ProductId == dataToAdd.ProductId) {
                            existProduct = 1;
                        }
                    }

                    // in case its new product in cart
                    if (existProduct == 0) {

                        var updadteData = {
                            ProductId: dataToAdd.ProductId,
                            Quantity: dataToAdd.Quantity
                        }

                        log.msg("try to add the new product to the cart");

                        // update the cart with the new product
                        cartModel.findOneAndUpdate({ _id: user.CartID },
                            { $addToSet: { products: updadteData } }
                            , { new: true }, async (err, kit) => {

                                // array of products Ids
                                var ids = [];

                                for (var product of kit._doc.products)
                                    ids.push(product._doc.ProductId);


                                // find the product by id and return the data of the product
                                productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                                    // if not found products in DB by givven ids
                                    if (cart == null) {
                                        log.error("products not founded by ids");
                                        return resolve({
                                            success: false, type: 9, message: "products not founded by ids"
                                        })
                                    }

                                    // add the quantity for every product and price
                                    for (let i = 0; i < cart.length; i++) {
                                        cart[i]._doc['Price'] = cart[i].PriceForCustomer
                                        for (let j = 0; j < kit.products.length; j++) {
                                            if (cart[i].id == kit.products[j].ProductId) {
                                                cart[i]._doc['Quantity'] = kit.products[j].Quantity
                                                break;
                                            }
                                        }
                                    }

                                    log.info("success to update the quantity of product");

                                    return resolve({
                                        success: true,
                                        message: "success to update the quantity of product",
                                        cart: cart
                                    });

                                }).where('_id').in(ids).exec((err) => {
                                    if (err) {
                                        log.error("failed to find products by givven id");
                                        return reject({ success: false, type: 8, message: "failed to find products by givven id, Error: " + err.message });
                                    }
                                })
                            }).catch((err) => {
                                log.error("failed to update the new product in cart");
                                return reject({ success: false, type: 7, message: "failed to update the new product in cart, Error: " + err.message });
                            })
                    }

                    // in case its exist product in cart
                    if (existProduct == 1) {
                        cartModel.findOneAndUpdate({
                            _id: user.CartID,
                            'products.ProductId': dataToAdd.ProductId
                        }, { $set: { 'products.$.Quantity': dataToAdd.Quantity } }, { new: true }, async (err, data) => {

                            // array of products Ids
                            var ids = [];

                            for (var product of data._doc.products)
                                ids.push(product._doc.ProductId);


                            // find the product by id and return the data of the product
                            productModel.find({}, "Name PriceForCustomer Img", async (err, cart) => {

                                // if not found products in DB by givven ids
                                if (cart == null) {
                                    log.error("products not founded by ids");
                                    return resolve({
                                        success: false, type: 10, message: "products not founded by ids"
                                    })
                                }

                                // add the quantity for every product and price
                                for (let i = 0; i < cart.length; i++) {
                                    cart[i]._doc['Price'] = cart[i].PriceForCustomer
                                    for (let j = 0; j < data.products.length; j++) {
                                        if (cart[i].id == data.products[j].ProductId) {
                                            cart[i]._doc['Quantity'] = data.products[j].Quantity
                                            break;
                                        }
                                    }
                                }

                                log.info("success to update the quantity to the exist product");

                                return resolve({
                                    success: true,
                                    message: "success to update the quantity to the exist product",
                                    cart: cart
                                });

                            }).where('_id').in(ids).exec((err) => {
                                if (err) {
                                    log.error("failed to find products by givven id");
                                    return reject({ success: false, type: 11, message: "failed to find products by givven id, Error: " + err.message });
                                }
                            })
                        })
                    }
                }).catch((err) => {
                    log.error("error in finding cart by id");
                    return reject({
                        success: false,
                        type: 5,
                        message: "failed in finding cart by id"
                    })
                })
            })

        }).catch((err) => {
            log.error("error in finding user by token");
            return reject({
                success: false,
                type: 2,
                message: "failed in finding user by token"
            })
        })
    }).catch((err) => {
        log.error("error in add to cart api request");
        return reject({
            success: false,
            type: 1,
            message: "failed in add to cart api request"
        })
    })
}

// ************ \\





exports.deleteProductFromCart = (dataToDelete) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request : delete product from cart");

        // get the user cart by his token
        User.findOne({ Token: dataToDelete.Token }, async (err, user) => {

            // in case user not founded
            if (!user) {
                log.error("user not founded");
                return resolve({ success: false, type: 3, message: "user not found, check the token" })
            }

            // find the cart of the user and delete the product from the cart





            cartModel.findOneAndUpdate({ _id: user.CartID }, { $pull: { 'products': { ProductId: dataToDelete.ProductId } } }, async (err, deletedProduct) => {

                if (!deletedProduct) {
                    log.error("not found product in cart");
                    return resolve({ success: false, type: 5, message: "not found product in cart " })
                }

                cartModel.findOne({ _id: user.CartID }, async (err, cart) => {

                    if (!cart) {
                        log.error("not found cart");
                        return resolve({ success: false, type: 7, message: "not found cart " })
                    }


                    // array of products Ids
                    var ids = [];

                    for (var product of cart._doc.products)
                        ids.push(product._doc.ProductId);


                    // find the product by id and return the data of the product
                    productModel.find({}, "Name PriceForCustomer Img", async (err, products) => {

                        // if not found products in DB by givven ids
                        if (products == null) {
                            log.error("products not founded by ids");
                            return resolve({
                                success: false, type: 9, message: "products not founded by ids"
                            })
                        }

                        // add the quantity for every product and price
                        for (let i = 0; i < products.length; i++) {
                            products[i]._doc['Price'] = products[i].PriceForCustomer
                            for (let j = 0; j < cart.products.length; j++) {
                                if (products[i].id == cart.products[j].ProductId) {
                                    products[i]._doc['Quantity'] = cart.products[j].Quantity
                                    break;
                                }
                            }
                        }

                        log.info("success to delete the product");

                        return resolve({
                            success: true,
                            message: "success to delete the product",
                            cart: products
                        });

                    }).where('_id').in(ids).exec((err) => {
                        if (err) {
                            log.error("failed to find products by givven id");
                            return reject({ success: false, type: 8, message: "failed to find products by givven id, Error: " + err.message });
                        }
                    })
                }).catch((err) => {
                    log.error("error in finding cart");
                    return reject({ success: false, type: 6, message: "error in finding cart " + err.message });
                })
            }).catch((err) => {
                log.error("error in finding cart and delete the product");
                return reject({ success: false, type: 4, message: "error in finding cart and delete the product " + err.message });
            })
        }).catch((err) => {
            log.error("error in finding user and return the cart");
            return reject({ success: false, type: 2, message: "error in finding user and return the cart, Error : " + err.message });
        })
    }).catch((err) => {
        log.error("error in api request to delete product from the cart");
        return reject({ success: false, type: 1, message: "error in api request to delete product from the cart , Error : " + err.message });
    })
}






// set cart by user Id \\

exports.setCartByUserToken = (dataCart) => {

    return new Promise((resolve, reject) => {

        log.msg("Api request: set cart by user Id");

        // get cart id from user
        User.findOne({ "Token": dataCart.Token }, "CartID", async (err, cartId) => {

            // if get an error
            if (err) {
                log.error("error in find cart id by user Id in DB, check the user Id , Error: " + err.message);

                return resolve({
                    success: false,
                    type: 1,
                    message: "error in find cart by user Id in DB, check the user Id "
                })
            };

            // if cartId not founded, creat a new one
            if (cartId._doc.CartID == undefined) {

                const newCart = new cartModel({
                    Products: dataCart.Products
                });

                newCart.save((err, caartush) => {
                    if (err) {
                        log.error("error in find cart id by user Id in DB, check the user Id , Error: " + err.message);

                        return resolve({
                            success: false,
                            type: 1,
                            message: "error in find cart by user Id in DB, check the user Id "
                        })
                    };
                    return resolve({
                        success: true,
                        message: "success to set cart data",
                        cart: caartush
                    });
                })



                //log.info("not found cart id by user Id in DB");

                /*                 return resolve({
                                    success: false,
                                    type: 2,
                                    message: "not found cart id by user Id in DB "
                                }) */
            }

            log.info("succes to get cart id");

            cartModel.findOneAndUpdate({ "_id": cartId._doc.CartID }, { $set: { Products: dataCart.Products } }, { new: true }, async (err, cart) => {

                // if get an error
                if (err) {
                    log.error("error in update cart by Id in DB, Error: " + err.message);

                    return resolve({
                        success: false,
                        type: 3,
                        message: "error in update cart by Id in DB " + err.message
                    })
                };

                // if cart not founded
                if (!cart) {
                    log.info("not found cart for this user in DB");

                    return resolve({
                        success: false,
                        type: 4,
                        message: "not found cart for this user in DB "
                    })
                }


                log.info("succes to set cart data");

                return resolve({
                    success: true,
                    message: "success to set cart data",
                    cart: cart
                });

            }).catch((err) => {
                log.error("Failed in update cart in DB, Error: " + err.message);
                return reject({ success: false, type: 5, message: "Failed in update cart in DB, Error: " + err.message });
            });
        }).catch((err) => {
            log.error("Failed in finding cart by user id in DB, Error: " + err.message);
            return reject({ success: false, type: 6, message: "Failed in finding cart by user id in DB, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in set cart request, Error: " + err.message);
        return reject({ success: false, type: 7, message: "Failed in set cart request, Error: " + err.message });
    });
}

  // ************ \\