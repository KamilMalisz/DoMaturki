import express from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  searchCityByName,
  updateCity,
} from "../controllers/city.controller.js";
import { verifyAdminToken } from "../utils/verifyAdminToken.js";

const router = express.Router();

router.patch("/update/:id", verifyAdminToken, updateCity);
router.get("/searchByName/:name", searchCityByName);
router.post("/create", verifyAdminToken, createCity);
router.get("/all", getAllCities);
router.get("/:id", verifyAdminToken, getCityById);

export default router;
