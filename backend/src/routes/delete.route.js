// src/routes/delete.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteUser } from "../controllers/delete.controller.js"; // we'll define this next

const router = express.Router();

// Only authenticated users can delete themselves
router.delete("/:id", protectRoute, deleteUser);

export default router;
