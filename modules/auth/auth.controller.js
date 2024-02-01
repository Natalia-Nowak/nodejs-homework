const jwt = require("jsonwebtoken");
const passportJwt = require("passport-jwt");
const { User } = require("../users/user.schema");
const { createUser } = require("../users/users.controller");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({ message: "Hasło lub Email niepoprawne" });
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
};

const register = async (req, res) => {
  if (
    !Object.hasOwn(req.body, "email") ||
    !Object.hasOwn(req.body, "password")
  ) {
    return res
      .status(400)
      .json({ message: "Błąd z Joi lub innej biblioteki walidacji" });
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  return createUser(req, res);
};

const logout = async (req, res) => {
  const foundUser = await User.findOne({ _id: req.user.id });

  if (!foundUser) {
    return res.status(401).json({ message: "Not authorized" });
  }
  foundUser.token = "";
  foundUser.save();
  return res.status(204).json();
};

const current = async (req, res) => {
  const foundUser = await User.findOne({ _id: req.user.id });

  if (!foundUser) {
    return res.status(401).json({ message: "Not authorized" });
  }

  return res.json({
    email: foundUser.email,
    subscription: foundUser.subscription,
  });
};

module.exports = {
  login,
  register,
  logout,
  current,
};
