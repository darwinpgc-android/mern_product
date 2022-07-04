const express = require("express");
const { model } = require("mongoose");
const router = express();

const {
  getProductById,
  getProduct,
  createProduct,
  delProduct,
  updateProduct
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// route parameters

router.param("productId", getProductById);
router.param("userId", getUserById);

// get routes for product

router.get("/product/:productId", getProduct);

router.get("/product/photo/:productId");

// post router for product

router.post(
  "/product/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// delete product

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  delProduct
);
// update product

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

module.exports = router;
  