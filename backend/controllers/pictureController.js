const fs = require("fs");
const path = require("path");

// Read the JSON data
const pictureData = require("./../data/pictureLegend.json");

// Get all pictures data
exports.getAllPictures = (req, res) => {
  try {
    res.status(200).json(pictureData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching picture data", error: error.message });
  }
};

// Get picture by ID
exports.getPictureById = (req, res) => {
  try {  
    const { id } = req.params;
    const picture = pictureData.find((pic) => pic.imageId === parseInt(id));

  
    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }

    res.status(200).json(picture);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching picture", error: error.message });
  }
};

// Get pictures by point ID
exports.getPicturesByPointId = (req, res) => {
  console.log("get picture by pointID: ")
  try {
    const { pointId } = req.params;
    const pictures = pictureData.filter(
      (pic) => pic.pointId === parseInt(pointId)
    );

    if (pictures.length === 0) {
      return res
        .status(404)
        .json({ message: "No pictures found for this point" });
    }
console.log(pictures)
    res.status(200).json(pictures);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pictures", error: error.message });
  }
};

exports.checkPointHasPictures = (req, res) => {
  try {
    const { pointId } = req.params;
    const hasPictures = pictureData.some(
      (pic) => pic.pointId === parseInt(pointId)
    );

    res.status(200).json({
      pointId: parseInt(pointId),
      hasPictures: hasPictures,
      count: hasPictures
        ? pictureData.filter((pic) => pic.pointId === parseInt(pointId)).length
        : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking if point has pictures",
      error: error.message,
    });
  }
};

// Bulk check if points have pictures
exports.bulkCheckPointsHavePictures = (req, res) => {
  try {
    const { pointIds } = req.body; // Expecting an array of pointIds

    if (!Array.isArray(pointIds)) {
      return res.status(400).json({ message: "pointIds must be an array" });
    }

    // Build a map for fast lookup
    const result = pointIds.map((pid) => {
      const count = pictureData.filter(
        (pic) => pic.pointId === parseInt(pid)
      ).length;
      return {
        pointId: parseInt(pid),
        hasPictures: count > 0,
        count,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error checking points for pictures",
      error: error.message,
    });
  }
};
