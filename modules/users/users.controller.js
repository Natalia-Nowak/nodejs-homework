const { User } = require("./user.schema");
const gravatar = require("gravatar");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      subscription: "starter",
      avatarURL: gravatar.url(req.body.email),
    });
    user.setPassword(req.body.password);

    await user.save();
    return res.json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    return res.status(400).json({ message: "Użytkownik istnieje" });
  }
};

const updateUser = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.id });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

const updateAvatar = async (req, res) => {
  return res.status(200).json({ message: "Plik wrzucony pomyślnie" });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateAvatar,
};
