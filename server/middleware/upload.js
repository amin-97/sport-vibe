// server/middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

module.exports = {
  wrestlingResultsUpload: upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
};
