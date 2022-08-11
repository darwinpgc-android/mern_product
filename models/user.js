// everything desgined in schema should be singular and there folders should be plural
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuid } = require("uuid");

const { Schema } = mongoose; // schemas are known as structure of databases..............

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname:       {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    // random string to be added to password.........
    role: {
      // roles defines the level of power each user has (0: user, 1: admin)
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

//---------- virtual function logic start ----------------------

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid();
    console.log(this.salt);
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

//---------- virtual function logic end ----------------------

//---------- methods function logic start ----------------------

userSchema.methods = {
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    console.log(this.salt);
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      console.log(`${err}...........`);
      return "";
    }
  },

  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

};

//---------- methods function logic end ----------------------

module.exports = mongoose.model("user", userSchema);
