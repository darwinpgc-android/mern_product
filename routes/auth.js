const express = require("express");
const { body, check } = require("express-validator");

const router = express.Router();

const { signup, signin, signout
 } = require("../controllers/auth");

router.post(
  "/auth/signup",
  [
    check("email", "Enter correct email").isEmail(),
    check("password", "Minimum 8 character").isLength({ min: 8 }),
  ],
  signup
)

router.post(
  "/auth/signin",
  [
    check("email", "email is incorrect").isEmail(),
    check("password", "email is incorrect").isLength({ min: 8 }),
  ],
  signin
);

router.get("/auth/signout", signout);



module.exports = router;
