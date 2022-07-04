const express = require("express");
const router = express();

const {
  getCategoryById,
  createCategory,
  updateCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/category");

const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");

// params

router.param("userId", getUserById); // parameter to get id from url

router.param("categoryId", getCategoryById);

// routes

// get request

router.get("/category/:categoryId", getCategory);

router.get("/categories", getAllCategories);

// create request

router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// updating the category

router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// delete category

router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
