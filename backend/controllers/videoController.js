const fs = require("fs");
const path = require("path");

// Read the JSON data
const videoData = require("./../data/videoLegend.json");

// Get all videos data
exports.getAllVideos = (req, res) => {
  try {
    res.status(200).json(videoData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching video data", error: error.message });
  }
};

// Get video by ID (request from frontend)
exports.getVideoById = (req, res) => {
  try {
    const { id } = req.params;
    const video = videoData.find((vid) => vid.videoId === parseInt(id));

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Add the full video URL to the response
    const host = req.get("host");
    const protocol = req.protocol;
    const videoUrl = `${protocol}://${host}/videos/${video.videoName}`;

    res.status(200).json({
      ...video,
      videoUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching video", error: error.message });
  }
};

// Get videos by point ID
exports.getVideosByPointId = (req, res) => {
  try {
    const { pointId } = req.params;
    const videos = videoData.filter((vid) => vid.pointId === parseInt(pointId));

    if (videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found for this point" });
    }

    // Add the full video URL to each video
    const host = req.get("host");
    const protocol = req.protocol;
    const videosWithUrls = videos.map((video) => ({
      ...video,
      videoUrl: `${protocol}://${host}/videos/${video.videoName}`,
    }));

    res.status(200).json(videosWithUrls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching videos", error: error.message });
  }
};

// Check if a point has associated videos
exports.checkPointHasVideos = (req, res) => {
  try {
    const { pointId } = req.params;
    const hasVideos = videoData.some(
      (vid) => vid.pointId === parseInt(pointId)
    );

    res.status(200).json({
      pointId: parseInt(pointId),
      hasVideos: hasVideos,
      count: hasVideos
        ? videoData.filter((vid) => vid.pointId === parseInt(pointId)).length
        : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking if point has videos",
      error: error.message,
    });
  }
};

// En gros: check if points have videos
exports.bulkCheckPointsHaveVideos = (req, res) => {
  try {
    const { pointIds } = req.body; // Expecting an array of pointIds

    if (!Array.isArray(pointIds)) {
      return res.status(400).json({ message: "pointIds must be an array" });
    }

    const result = pointIds.map((pid) => {
      const count = videoData.filter(
        (vid) => vid.pointId === parseInt(pid)
      ).length;
      return {
        pointId: parseInt(pid),
        hasVideos: count > 0,
        count,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error checking points for videos",
      error: error.message,
    });
  }
};
