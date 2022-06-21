const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const crypto = require("crypto");

const User = require("../models/user");
const { json } = require("body-parser");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array(),
    });
  }

  const user = new User(req.body); // make a object of schema

  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        err: "not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  // const authentication = (salt, password, hash) => {
  //   let value = crypto
  //     .createHmac("sha256", salt)
  //     .update(password)
  //     .digest("hex");

  //    return value ===  hash
  // };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array(),
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "User email does not exist ",
      });
    }

    // if (!authentication(user.salt, password, user.encry_password)) {
    //   return res.status(401).json({
    //     error: "Email and password do not match",
    //   });
    // }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put token in cookie

    res.cookie("token", token, { expire: new Date() + 9999 });

    // sending response to front end

    const { _id, name, email, role } = user;
    return res.status(200).json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.cookie("token");
  res.json({
    message: "user signout successfully",  
  });
};

// protected routes

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,

  userProperty: "auth"
})


// custome middlewares


exports.isAuthenticated = (req, res, next) =>{
  let checker = req.profile && req.auth && req.profile._id === req.auth._id
  if(!checker){
    return res.status(403).json({
      error: "Access denied"
    })
  }
  next()
}

exports.isAdmin = (req, res, next) =>{
  if(req.profile.role === 0){
    res.status(403).json({
      error: "you are not admin, Access denied"
    })
  }
  next()
}