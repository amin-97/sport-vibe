// server/routes/api/editorials.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const validateEditorial = require("../../middleware/editorialValidation");
const editorialController = require("../../controllers/editorialController");
const upload = require("../../middleware/multer");

// Check if all imports are properly defined
console.log("Checking middleware and controller:", {
  validateEditorial: !!validateEditorial,
  editorialController: !!editorialController?.createEditorial,
  verifyToken: !!verifyToken,
  isAdmin: !!isAdmin,
  upload: !!upload,
});

// Define routes
router.get("/", editorialController.getAllEditorials);
router.get("/:id", editorialController.getEditorialById);
router.get("/category/:category", editorialController.getEditorialsByCategory);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateEditorial,
  editorialController.createEditorial
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateEditorial,
  editorialController.updateEditorial
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  editorialController.deleteEditorial
);

module.exports = router;
