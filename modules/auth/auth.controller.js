const jwt = require("jsonwebtoken");
const passportJwt = require("passport-jwt");
const { User } = require("../users/user.schema");
const { createUser } = require("../users/users.controller");

const login = async (req, res) => {
  try {
    if (
      !Object.hasOwn(req.body, "email") ||
      !Object.hasOwn(req.body, "password")
    ) {
      return res.status(400).json({ message: "Bad request" });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      return res.status(400).json({ message: "Email or password is invalid" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );

    user.token = token;
    user.save();

    return res.json({
      data: { token },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const register = async (req, res) => {
  try {
    if (
      !Object.hasOwn(req.body, "email") ||
      !Object.hasOwn(req.body, "password")
    ) {
      return res.status(400).json({ message: "Bad request" });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    return createUser(req, res);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const logout = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user.id });

    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized" });
    }
    foundUser.token = "";
    foundUser.save();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const current = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user.id });

    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json({
      email: foundUser.email,
      subscription: foundUser.subscription,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

module.exports = {
  login,
  register,
  logout,
  current,
};
