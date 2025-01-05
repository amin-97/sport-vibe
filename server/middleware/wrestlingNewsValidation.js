// server/middleware/wrestlingNewsValidation.js
const validateWrestlingNews = (req, res, next) => {
  const { title, category, description, content, status, tags } = req.body;
  const errors = [];

  // Status validation
  if (status && !["draft", "published"].includes(status)) {
    errors.push("Status must be either draft or published");
  }

  // For drafts, only validate title and category
  if (status === "draft") {
    if (!title) {
      errors.push("Title is required even for drafts");
    } else if (title.length < 5 || title.length > 200) {
      errors.push("Title must be between 5 and 200 characters");
    }

    const validWrestlingCategories = ["wwe", "aew"];
    if (!category) {
      errors.push("Category is required even for drafts");
    } else if (!validWrestlingCategories.includes(category)) {
      errors.push("Invalid category. Must be one of: wwe, aew");
    }
  } else {
    // Full validation for published content
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
      errors.push("Invalid category. Must be one of: wwe, aew");
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
  }

  // Tags validation (optional for both draft and published)
  if (tags) {
    try {
      const parsedTags = JSON.parse(tags);
      if (!Array.isArray(parsedTags)) {
        errors.push("Tags must be an array");
      } else if (parsedTags.some((tag) => typeof tag !== "string")) {
        errors.push("All tags must be strings");
      }
    } catch (error) {
      errors.push("Invalid tags format - must be a JSON string array");
    }
  }

  // Image validation (optional for both draft and published)
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
