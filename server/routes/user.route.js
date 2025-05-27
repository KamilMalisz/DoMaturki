import express from "express";
import path from "path";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyAdminToken } from "../utils/verifyAdminToken.js";
import { verifyUserToken } from "../utils/veryfiUserToken.js";
import createUploadMiddleware from "../utils/imgFileUpload.js";

const router = express.Router();

router.patch(
  "/update/:id",
  verifyUserToken,
  createUploadMiddleware(path.join("public", "img", "avatars")).single(
    "avatar"
  ),
  updateUser
);

router.get("/all", verifyAdminToken, getAllUsers);
router.get("/:id", getUser);

export default router;
