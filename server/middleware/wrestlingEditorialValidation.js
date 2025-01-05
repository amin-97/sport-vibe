const validateWrestlingEditorial = (req, res, next) => {
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Request File:", req.file);

  const { title, category, summary, content, status, featured } = req.body;
  const errors = [];

  // Title validation
  if (!title) {
    errors.push("Title is required");
  } else if (title.length < 5 || title.length > 200) {
    errors.push("Title must be between 5 and 200 characters");
  }

  // Category validation
  const validCategories = ["nba", "wrestling"];
  if (!category) {
    errors.push("Category is required");
  } else if (!validCategories.includes(category)) {
    errors.push("Invalid category. Must be one of: nba, wrestling");
  }

  // Summary validation
  if (!summary) {
    errors.push("Summary is required");
  } else if (summary.length < 10 || summary.length > 1000) {
    errors.push("Summary must be between 10 and 1000 characters");
  }

  // Content validation
  if (!content) {
    errors.push("Content is required");
  } else if (content.length < 100) {
    errors.push("Content must be at least 100 characters long");
  }

  // Status validation (optional)
  if (status && !["draft", "published"].includes(status)) {
    errors.push("Invalid status. Must be either draft or published");
  }

  // Featured validation (optional)
  if (
    featured !== undefined &&
    typeof featured !== "boolean" &&
    featured !== "true" &&
    featured !== "false"
  ) {
    errors.push("Featured must be a boolean value");
  }

  // Key Arguments validation
  if (req.body.keyArguments) {
    try {
      const args = JSON.parse(req.body.keyArguments);
      if (!Array.isArray(args)) {
        errors.push("Key arguments must be an array");
      } else if (args.length === 0) {
        errors.push("At least one key argument is required");
      } else if (args.some((arg) => typeof arg !== "string")) {
        errors.push("All key arguments must be strings");
      }
    } catch (error) {
      errors.push("Invalid key arguments format - must be a JSON string array");
    }
  } else {
    errors.push("Key arguments are required");
  }

  // Topics validation (optional)
  if (req.body.topics) {
    try {
      const topicsArray = JSON.parse(req.body.topics);
      if (!Array.isArray(topicsArray)) {
        errors.push("Topics must be an array");
      } else if (topicsArray.some((topic) => typeof topic !== "string")) {
        errors.push("All topics must be strings");
      }
    } catch (error) {
      errors.push("Invalid topics format - must be a JSON string array");
    }
  }

  // Related Content validation (optional)
  if (req.body.relatedContent) {
    try {
      const relatedContent = JSON.parse(req.body.relatedContent);
      if (!Array.isArray(relatedContent)) {
        errors.push("Related content must be an array");
      } else {
        for (const item of relatedContent) {
          if (!item.type || !item.item) {
            errors.push(
              "Each related content item must have type and item properties"
            );
          }
          if (!["news", "editorial", "result"].includes(item.type)) {
            errors.push(
              "Invalid related content type. Must be: news, editorial, or result"
            );
          }
        }
      }
    } catch (error) {
      errors.push("Invalid related content format");
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
    console.log("Validation Errors:", errors);
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

module.exports = validateWrestlingEditorial;
