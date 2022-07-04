const Category = require("../models/category");

// middleware

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "category not found in database",
      });
    }
    req.category = category;
    next();
  });
};

// functions

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "unable to save data",
      });
    }
    res.status(200).json(category);
  });
};



exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "no categories found",
      });
    }
    return res.status(200).json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // available through middleware
  category.name = req.body.name; // update value being recieved from request by user

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update",
      });
    }
    return res.status(200).json(updatedCategory);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete",
      });
    }
    return res.status(200).json({
      message: `${category} is deleted successfully`
    });
  });
};
