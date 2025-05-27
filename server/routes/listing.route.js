import express from "express";
import path from "path";
import {
  createListing,
  finishListing,
  getFilteredListingsInBounds,
  getLatestListings,
  getListing,
  searchListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/veryfiUserToken.js";
import createUploadMiddleware from "../utils/imgFileUpload.js";

const router = express.Router();

router.post(
  "/",
  verifyUserToken,
  createUploadMiddleware(path.join("public", "img", "listings")).array(
    "images",
    10
  ),
  createListing
);

router.patch(
  "/",
  verifyUserToken,
  createUploadMiddleware(path.join("public", "img", "listings")).array(
    "images",
    10
  ),
  updateListing
);

router.get("/search", searchListings);
router.post("/finish", verifyUserToken, finishListing);
router.get("/latest", getLatestListings);
router.get("/searchInBounds", getFilteredListingsInBounds);
router.get("/:id", getListing);

export default router;
