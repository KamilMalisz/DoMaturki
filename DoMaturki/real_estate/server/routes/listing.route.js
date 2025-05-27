import express from "express";
import { getLatestListings } from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/latest", getLatestListings);

export default router;
