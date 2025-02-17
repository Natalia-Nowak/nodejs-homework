const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const user = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
});

user.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
user.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model("user", user);

module.exports = {
  User,
};
