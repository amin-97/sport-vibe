// server/routes/api/wrestlingEditorials.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const {
  validateWrestlingEditorial,
} = require("../../middleware/editorialValidation");
const {
  wrestlingEditorialController,
} = require("../../controllers/editorialController");
const upload = require("../../middleware/multer");

router.get("/", wrestlingEditorialController.getAllEditorials);
router.get("/slug/:slug", wrestlingEditorialController.getEditorialBySlug);
router.get(
  "/drafts",
  verifyToken,
  isAdmin,
  wrestlingEditorialController.getDrafts
);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingEditorial,
  wrestlingEditorialController.createEditorial
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingEditorial,
  wrestlingEditorialController.updateEditorialBySlug
);

router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  wrestlingEditorialController.deleteEditorial
);

module.exports = router;
