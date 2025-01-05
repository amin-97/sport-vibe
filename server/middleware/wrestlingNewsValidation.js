// server/middleware/newsValidation.js
const validateWrestlingNews = (req, res, next) => {
  const { title, category, description, content } = req.body;
  const errors = [];

  // Title validation
  if (!title) {
    errors.push("Title is required");
  } else if (title.length < 5 || title.length > 200) {
    errors.push("Title must be between 5 and 200 characters");
  }

  // Category validation
  const validWrestlingCategories = ["wwe", "aew"];
  if (!category) {
    errors.push("Category is required");
  } else if (!validWrestlingCategories.includes(category)) {
    errors.push("Invalid category. Must be one of: nba, wwe, aew");
  }

  // Description validation
  if (!description) {
    errors.push("Description is required");
  } else if (description.length < 10 || description.length > 500) {
    errors.push("Description must be between 10 and 500 characters");
  }

  // Content validation
  if (!content) {
    errors.push("Content is required");
  } else if (content.length < 50) {
    errors.push("Content must be at least 50 characters long");
  }

  // Tags validation (optional)
  if (req.body.tags) {
    try {
      const tags = JSON.parse(req.body.tags);
      if (!Array.isArray(tags)) {
        errors.push("Tags must be an array");
      } else if (tags.some((tag) => typeof tag !== "string")) {
        errors.push("All tags must be strings");
      }
    } catch (error) {
      errors.push("Invalid tags format - must be a JSON string array");
    }
  }

  // Image validation (if provided)
  if (req.file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      errors.push("Invalid image type. Allowed types: JPG, PNG, WebP");
    }

    // 5MB size limit
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      errors.push("Image size must be less than 5MB");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

module.exports = validateWrestlingNews;
