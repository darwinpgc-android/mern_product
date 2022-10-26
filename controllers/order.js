const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") // font put comma between two json fields
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No ordr found in DB",
        });
      }
      res.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json(
        { error: "Failed to create order",}
      );
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name lastname")
    .exec((err, orders) => {
      if (err) { 
        return res.status(400).json({
          error: "no orders found",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status }},
    (err, order) => {
        if(err){
            return res.status(400).json({
                error: "cannot update order"
            })
        }
        res.json(order)
    }
  );
};
