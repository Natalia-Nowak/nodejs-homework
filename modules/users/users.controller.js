const { User } = require("./user.schema");

const getUsers = async (req, res) => {
  const users = await User.find();
  return res.json({ data: users });
};

const getUserById = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};

const createUser = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      subscription: "starter",
    });
    user.setPassword(req.body.password);

    await user.save();
    return res.json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    return res.status(400).json({ message: "Użytkownik istnieje" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, subscription, token } = req.body;

  user.email = email;
  user.subscription = subscription;
  user.token = token;

  if (password) {
    user.setPassword(password);
  }
  await user.save();
  return res.json({ data: result });
};

const deleteUser = async (req, res) => {
  const result = await User.findOneAndDelete({ _id: req.params.id });
  return res.json({ data: result });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
