const productModel = require('../models/product');
const categoryModel = require('../models/category');
const log = require("../../global/console");







// get all categories from DB \\

exports.getCategories = (req, res) => {

  return new Promise((resolve, reject) => {

    log.msg("Api request: get categories data");

    categoryModel.find({}, "Name Img", (err, data) => {

      // if get an error
      if (err) {
        log.error("error in find categories in DB, Error: " + err.message);

        return resolve({
          success: false,
          type: 1,
          message: "error in find categories in DB " + err.message
        })
      };

      // if data not founded
      if (!data) {
        log.info("not found categories in DB");

        return resolve({
          success: false,
          type: 2,
          message: "not found categories in DB " + err.message
        })
      }

      // in case no errors and categories founded
      log.info("succes to get categories data");

      return resolve({
        success: true,
        message: "success to get categories data",
        categories: data
      });

    }).catch((err) => {
      log.error("Failed in finding categories in DB, Error: " + err.message);
      return reject({ success: false, type: 3, message: "Failed in finding categories in DB, Error: " + err.message });
    });
  }).catch((err) => {
    log.error("Failed in get categories request, Error: " + err.message);
    return reject({ success: false, type: 4, message: "Failed in get categories request, Error: " + err.message });
  });
}

// ************ \\






// get products data fo display in home page \\

exports.getProductsDataForHomePage = (req, res) => {

  return new Promise((resolve, reject) => {

    log.msg("Api request: get products data for home page");

    productModel.find({}, "Name PriceForCustomer Img", async (err, data) => {

      // if get an error
      if (err) {
        log.error("error in find products in DB, Error: " + err.message);

        return resolve({
          success: false,
          type: 1,
          message: "error in find products in DB " + err.message
        })
      };

      // if data not founded
      if (!data) {
        log.info("not found products in DB");

        return resolve({
          success: false,
          type: 2,
          message: "not found products in DB " + err.message
        })
      }

      // in case no errors and products founded
      log.info("success to get products data for home page");

      return resolve({
        success: true,
        message: "success to get products data for home page",
        products: data
      });

    }).catch((err) => {
      log.error("Failed in finding categories in DB, Error: " + err.message);
      return reject({ success: false, type: 3, message: "Failed in finding categories in DB, Error: " + err.message });
    });
  }).catch((err) => {
    log.error("Failed in get categories request, Error: " + err.message);
    return reject({ success: false, type: 4, message: "Failed in get categories request, Error: " + err.message });
  });
}

// ************ \\






// get products data by category id \\

exports.getAllProductsByCategorie = (categoryId) => {

  return new Promise((resolve, reject) => {

    log.msg("Api request: get products data by category id");

    productModel.find({ Category: categoryId }, "Name PriceForCustomer Img", (err, data) => {

      // if get an error
      if (err) {
        log.error("error in find products by category in DB, Error: " + err.message);

        return resolve({
          success: false,
          type: 1,
          message: "error in find products by category in DB " + err.message
        })
      };

      // if data not founded
      if (data.length == 0) {
        log.info("not found products by category in DB");

        return resolve({
          success: false,
          type: 2,
          message: "not found products by category in DB "
        })
      }

      // in case no errors and products by category founded
      log.info("success to get products by category");

      return resolve({
        success: true,
        message: "success to get products by category",
        products: data
      });

    }).catch((err) => {
      log.error("Failed in finding products by category in DB, Error: " + err.message);
      return reject({ success: false, type: 3, message: "Failed in finding products by category in DB, Error: " + err.message });
    });
  }).catch((err) => {
    log.error("Failed in get products data by category id request, Error: " + err.message);
    return reject({ success: false, type: 4, message: "Failed in get products data by category id request, Error: " + err.message });
  });
}

// ************ \\






// get product data by product id \\

exports.getProductById = (productId) => {

  return new Promise((resolve, reject) => {

    log.msg("Api request: get product data by product id");

    productModel.find({ _id: productId }, (err, data) => {

      // if get an error
      if (err) {
        log.error("error in find product data by product id in DB");

        return resolve({
          success: false,
          type: 1,
          message: "error in finding product data by product id in DB "
        })
      };

      // if data not founded
      if (data.length == 0) {
        log.info("not found product data by product id in DB");

        return resolve({
          success: false,
          type: 2,
          message: "not found product data by product id in DB "
        })
      }

      // in case no errors and product data by product id founded
      log.info("success to get product data by product id");

      return resolve({
        success: true,
        message: "success to get product data by product id",
        product: data[0]._doc
      });

    }).catch((err) => {
      log.error("Failed in finding product data by product id in DB, Error: " + err.message);
      return reject({ success: false, type: 3, message: "Failed in finding product data by product id in DB, Error: " + err.message });
    });
  }).catch((err) => {
    log.error("Failed in get product data by product id request, Error: " + err.message);
    return reject({ success: false, type: 4, message: "Failed in get product data by product id request, Error: " + err.message });
  });
}

// ************ \\






/* exports.deleteItemById = (req) => {
  productModel.findOneAndDelete({ _id: req.body.param }, (err) => {
    err ? console.log(err) : console.log(`item ${req.body.param} deleted!`)
  })
}




exports.updateItemById = (req, res) => {
  productModel.findOneAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true }, (err, doc) => {
    err ? res.status(500).send(err) : res.send(doc);
  })
}




exports.saveItemInDB = (req, res, next) => {
  const item = new productModel({
    Name: req.body.Name,
    PriceForCustomer: req.body.PriceForCustomer,
    PriceForSupplier: req.body.PriceForSupplier,
    MinimumToSupplier: req.body.MinimumToSupplier,
    Manufacturer: req.body.Manufacturer,
    Description: req.body.Description,
    Img: req.body.Img,
    CatalogNumber: req.body.CatalogNumber,
    Cost: req.body.Cost,
    Inventory: req.body.Inventory,
    Category: req.body.Category,
    Tag: req.body.Tag,
    Size: req.body.Size
  });
  item.save().then(() => res.send(item));
  console.log("item succecfully saved");
  ;

} */


