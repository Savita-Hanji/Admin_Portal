import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/auth.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);
router.get("/me",protect,getCurrentUser);

// Example admin-only route
// router.get("/admin", protect, adminOnly, (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

export default router;
