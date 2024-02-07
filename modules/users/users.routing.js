const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./users.controller");
const { auth } = require("../auth/auth.middleware");

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/", auth, createUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
