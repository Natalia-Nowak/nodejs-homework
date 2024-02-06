const express = require("express");
const path = require("path");
const multer = require("multer");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateAvatar,
} = require("./users.controller");
const { auth } = require("../auth/auth.middleware");

const router = express.Router();

const uploadDirTmp = path.join(process.cwd(), "/tmp");
console.log("1" + uploadDirTmp);
const storageTmp = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirTmp);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const uploadMiddlewareTmp = multer({
  storage: storageTmp,
});

router.patch(
  "/avatars",
  auth,
  uploadMiddlewareTmp.single("avatar"),
  updateAvatar
);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/", auth, createUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
