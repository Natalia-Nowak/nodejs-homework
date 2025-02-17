const { User } = require("./user.schema");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");

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
  console.log(req.file);
  const newFileName = makename(10) + "." + req.file.originalname.split(".")[1];
  const temporaryPath = path.join(process.cwd(), "/tmp", req.file.originalname);
  const currentPath = path.join(process.cwd(), "/public/avatars/");

  Jimp.read(temporaryPath, (err, lenna) => {
    if (err) throw err;
    lenna.resize(250, 250).write(currentPath + newFileName);
  });

  req.user.avatarURL = "http://localhost:3000/avatars/" + newFileName;
  req.user.save();
  return res.status(200).json({ message: "File added" });
};

function makename(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateAvatar,
};
