const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// Get all videos
router.get("/videos", videoController.getAllVideos);

// Get video by ID
router.get("/videos/:id", videoController.getVideoById);

// Get videos by point ID
router.get("/points/:pointId/videos", videoController.getVideosByPointId);

// Check if a point has associated videos
router.get("/points/:pointId/has-videos", videoController.checkPointHasVideos);

// Bulk check if points have videos
router.post(
  "/points/bulk-has-videos",
  videoController.bulkCheckPointsHaveVideos
);

module.exports = router;
