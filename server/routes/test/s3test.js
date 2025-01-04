const express = require("express");
const router = express.Router();
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");

router.get("/test-s3", async (req, res) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    res.json({
      message: "Successfully connected to S3 bucket",
      contents: response.Contents,
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      message: "Failed to connect to S3",
      error: error.message,
      credentials: {
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        hasRegion: !!process.env.AWS_REGION,
        bucketName: process.env.AWS_BUCKET_NAME,
      },
    });
  }
});

module.exports = router;
