const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs").promises;
require("dotenv").config();
require("./modules/auth/auth.strategy");

const usersRouting = require("./modules/users/users.routing");
const authRouting = require("./modules/auth/auth.routing");
const contactsRouter = require("./routes/api/contacts");
mongoose.connection.on("connected", function () {
  console.log("Database connection successful");
});
mongoose.connection.on("error", function () {
  console.log("error");
  process.exit(1);
});
const connection = mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

const isAccessible = (folderPath) => {
  return fs
    .access(folderPath)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfNotExist = async (folderPath) => {
  if (!(await isAccessible(folderPath))) {
    await fs.mkdir(folderPath);
  }
};

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/users", usersRouting);
app.use("/auth", authRouting);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(3000, () => {
  createFolderIfNotExist(path.join(process.cwd(), "/tmp"));
  createFolderIfNotExist(path.join(process.cwd(), "/public/avatars"));
  console.log("Serwer działa na porcie 3000");
});

module.exports = app;
