const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const { signup, signin, signout, isSignedIn} = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("email", "Enter correct email").isEmail(),
    check("password", "Minimum 8 character").isLength({ min: 8 }),
  ],
  signup
)

router.post(
  "/signin",
  [
    check("email", "email is incorrect").isEmail(),
    check("password", "email is incorrect").isLength({ min: 8 }),
  ],
  signin
);

router.get("/signout", signout);

router.get('/testRoute', isSignedIn, (req, res) => {
  res.json({
    auth: req.auth
  })
})

module.exports = router;
