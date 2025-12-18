const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

// Route to get the 10 largest distances between consecutive points
router.get("/largest-distances", statController.getLargestDistances);

// Route to get total distance traveled
router.get("/total-distance", statController.getTotalDistance);

// Route to get longest continuous navigations
router.get("/longest-navigations", statController.getLongestContinuousNavigations);

// Route to get longest stops (escales)
router.get("/longest-stops", statController.getLongestStops);
module.exports = router;