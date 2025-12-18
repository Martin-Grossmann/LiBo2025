const express = require("express");
const router = express.Router();
const pointController = require("../controllers/pointController");

// Get all points
router.get("/", pointController.getAllPoints);

// Search points by description
router.get("/search", pointController.searchPoints);

// Get points between two dates
router.get("/dates", pointController.getPointsBetweenDates);

// Get points by year
router.get("/year/:year", pointController.getPointsByYear);

// Get a single point by ID (this should be last)
router.get("/:id", pointController.getPointById);

module.exports = router;
