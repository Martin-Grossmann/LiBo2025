const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");

// Get all pictures
router.get("/pictures", pictureController.getAllPictures);

// Get picture by ID
router.get("/pictures/:id", pictureController.getPictureById);

// Get pictures by point ID
router.get("/points/:pointId/pictures", pictureController.getPicturesByPointId);

// Check if a point has associated pictures
router.get(
  "/points/:pointId/has-pictures",
  pictureController.checkPointHasPictures
);

// Bulk check if points have pictures
router.post(
  "/points/bulk-has-pictures",
  pictureController.bulkCheckPointsHavePictures
);

module.exports = router;
