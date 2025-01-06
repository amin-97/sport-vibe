// server/routes/api/nbaEditorials.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const {
  validateNBAEditorial,
} = require("../../middleware/editorialValidation");
const {
  nbaEditorialController,
} = require("../../controllers/editorialController");
const upload = require("../../middleware/multer");

router.get("/", nbaEditorialController.getAllEditorials);
router.get("/slug/:slug", nbaEditorialController.getEditorialBySlug);
router.get("/drafts", verifyToken, isAdmin, nbaEditorialController.getDrafts);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBAEditorial,
  nbaEditorialController.createEditorial
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBAEditorial,
  nbaEditorialController.updateEditorialBySlug
);

router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  nbaEditorialController.deleteEditorial
);

module.exports = router;
