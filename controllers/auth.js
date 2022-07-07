const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const crypto = require("crypto");

const User = require("../models/user");

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
  console.log(email, password);

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

    if (!user.authenticate(password)) { // as "user" is returned instance of UserSchema , function 'authenticate' will be made available to this instance as well
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
  
  if(!res.cookie()){
    res.status(200).json({
      message: 'first log in '
    })
  }
  res.clearCookie("token")
  res.json({
    message: "user signout successfully",
  });
};
            
// protected routes

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "authenticate",
});

// custome middlewares

exports.isAuthenticated = (req, res, next) => {
  console.log(req.authenticate)
  let checker = req.profile && req.authenticate && req.profile._id == req.authenticate._id;
  if (!checker) {
    return res.status(403).json({
      error: "you are not authenticated",
    });
  }
  next();
};


exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "you are not admin, Access denied",
    });
  }
  next();
};
