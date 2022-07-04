// controller for routes , to export functions

const User = require("../models/user");
const Order = require("../models/order");

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
    { new: true},
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

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name") // fields should be separated using space
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "no order in this account",
        });
      }

      return res.status(200).json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store this in database

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, // new is used to get the updated object
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "unable to save purchase list",
        });
      }
      next();
    }
  );
};


exports.getUsers = (req, res) => {
  User.find({}).exec((err, user) => {
    if(err){
      return res.json({
        error: "No user found"
      })
    }

    return res.json(user)
    
  })
}
