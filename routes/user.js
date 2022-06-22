const express = require('express')
const router = express.Router();

const { getUser, getUserById, updateUser, userPurchaseList } = require('../controllers/user')
const {  isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')

router.param("userId", getUserById)

router.get("/:userId", isSignedIn, isAuthenticated, getUser);

router.put("/:userId", isSignedIn, isAuthenticated, updateUser);

router.get("/orders/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
