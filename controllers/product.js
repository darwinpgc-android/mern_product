const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); // local filesystem

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        res.status(400).json({
          error: "product not found",
        });
      }
      res.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  res.product.photo = undefined;
  return res.status(200).json(res.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (res.product.photo.data) {
    res.set("Content-Type", res.product.photo.contentType);
    return res.send(res.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  (form.keepExtensions = true),
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image",
        });
      }

      // destructuring the fields .
      const { name, description, price, category, stock } = fields;

      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({
          error: "include all fields",
        });
      }

      const product = new Product(fields);

      // handling files
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "file size too big",
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }

      // saving to database

      product.fromSchema();

      product.save((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "saving product to database failed",
          });
        }
        return res.json(product);
      });
    });
};

// delete product

exports.delProduct = (req, res) => {
  let product = res.product;
  console.log(product)
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete product",
      });
    }
    return res.json({
      message: `${deletedProduct.name} was successfully deleted `,
    });
  });
};
// update product

exports.updateProduct = (req, res) => {
  //
};
