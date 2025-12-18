const fs = require("fs");
const { console } = require("inspector");
const path = require("path");

// Helper function to read the trip_data.json file
const getTripData = () => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "trip_data.json"); // import data from trip_data.json
    const jsonData = fs.readFileSync(dataPath, "utf8");
    
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading trip data:", error);
    return [];
  }
};

// Get all points
exports.getAllPoints = (req, res) => {
  try {
    const points = getTripData();
    res.status(200).json(points);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching points", error: error.message });
  }
};

// Get a single point by ID
exports.getPointById = (req, res) => {
  try {
    const points = getTripData();
    const point = points.find((p) => p.entry_id === parseInt(req.params.id));

    if (!point) {
      return res.status(404).json({ message: "Point not found" });
    }

    res.status(200).json(point);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching point", error: error.message });
  }
};

// Get points by year
exports.getPointsByYear = (req, res) => {
  try {
    const year = req.params.year;
    const points = getTripData();
    const filteredPoints = points.filter((p) => p.year === year);

    res.status(200).json(filteredPoints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching points by year", error: error.message });
  }
};

// Search points by description
exports.searchPoints = (req, res) => {
  try {
    const searchTerm = req.query.term?.toLowerCase();

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const points = getTripData();
    const filteredPoints = points.filter(
      (p) => p.description && p.description.toLowerCase().includes(searchTerm)
    );

    res.status(200).json(filteredPoints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching points", error: error.message });
  }
};
// Search points between two dates
exports.getPointsBetweenDates = (req, res) => {
  console.log(req.query)
  try {
    const { startDate, endDate } = req.query;
    
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Both start date and end date are required" });
    }
    
    // Convert string dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD format." });
    }
    
    const points = getTripData();
    
    // Filter points between the two dates
    const filteredPoints = points.filter(point => {
      // Assuming each point has a date field in ISO format or similar
      const pointDate = new Date(point.date);
      return pointDate >= start && pointDate <= end;
    });
    
    res.status(200).json(filteredPoints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching points between dates", error: error.message });
  }
};