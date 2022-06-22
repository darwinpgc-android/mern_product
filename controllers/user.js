// controller for routes , to export functions

const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    // callback in databse function always returns 2 things, " error and object "
    if (err || !user) {
      return res.status(400).json({
        error: "no user was found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // get back here for password
  const { role, purchases, email, name, lastname } = req.profile;

  return res.json({
    role,
    purchases,
    email,
    name,
    lastname,
  }); 
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndmodify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "you are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {};
