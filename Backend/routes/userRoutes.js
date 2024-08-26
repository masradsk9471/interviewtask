import express from "express";
import { getAllUsers, login, signup, updateProfile } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup" , signup);

router.post("/login", login);

router.put("/updateProfile", protectRoute, updateProfile);

router.get("/getAllUsers", protectRoute, getAllUsers);

export default router;