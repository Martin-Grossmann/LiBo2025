const fs = require("fs");
const path = require("path");

// Helper function to read the trip_data.json file (copied from pointController.js)
const getTripData = () => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "trip_data.json");
    const jsonData = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading trip data:", error);
    return [];
  }
};
// Meilleures performances--------------------------------------------------------------------------------------------
// Calculate distance between two points using Haversine formula (in nautical miles)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceKm = R * c; // Distance in km
  const distanceNm = distanceKm / 1.852; // Convert to nautical miles
  
  return distanceNm;
};

// Get the 10 largest distances between consecutive points
exports.getLargestDistances = (req, res) => {
  try {
    const points = getTripData();
    
    // Sort points by date to ensure we're calculating distances in chronological order
    points.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const distances = [];
    
    // Calculate distance between consecutive points
    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];
      
      // Skip if coordinates are missing
      if (!currentPoint.lat || !currentPoint.long || !nextPoint.lat || !nextPoint.long) {
        continue;
      }
      
      const distance = calculateDistance(
        currentPoint.lat, 
        currentPoint.long, 
        nextPoint.lat, 
        nextPoint.long
      );
      
      distances.push({
        fromPoint: {
          entry_id: currentPoint.entry_id,
          description: currentPoint.description,
          date: currentPoint.date,
          coordinates: [currentPoint.lat, currentPoint.long]
        },
        toPoint: {
          entry_id: nextPoint.entry_id,
          description: nextPoint.description,
          date: nextPoint.date,
          coordinates: [nextPoint.lat, nextPoint.long]
        },
        distance: distance.toFixed(2), // Round to 2 decimal places
        unit: "Nm"
      });
    }
    
    // Sort distances in descending order and get top 10
    const largestDistances = distances
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10);
    
    res.status(200).json(largestDistances);
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating largest distances", 
      error: error.message 
    });
  }
};

// Get total distance traveled
exports.getTotalDistance = (req, res) => {
  try {
    const points = getTripData();
    
    // Sort points by date
    points.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let totalDistance = 0;
    
    // Calculate total distance
    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];
      
      // Skip if coordinates are missing
      if (!currentPoint.lat || !currentPoint.long || !nextPoint.lat || !nextPoint.long) {
        continue;
      }
      
      const distance = calculateDistance(
        currentPoint.lat, 
        currentPoint.long, 
        nextPoint.lat, 
        nextPoint.long
      );
      
      totalDistance += distance;
    }
    
    res.status(200).json({
      totalDistance: totalDistance.toFixed(2),
      unit: "Nm"
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating total distance", 
      error: error.message 
    });
  }
};
// End meilleures performances-----------------------------------------------------------------------------------------






// Get the longest continuous navigation periods (without stops of more than 1 day)
exports.getLongestContinuousNavigations = (req, res) => {
  try {
    const points = getTripData();
    
    // Sort points by date
    points.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const navigations = [];
    let currentNavigation = [];
    
    // Helper function to check if two dates are within 1 day of each other
    const areDatesConsecutive = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1;
    };
    
    // Find continuous navigation periods
    for (let i = 0; i < points.length; i++) {
      // If this is the first point or if it's consecutive with the previous point
      if (i === 0 || areDatesConsecutive(points[i-1].date, points[i].date)) {
        // If this is the start of a new navigation, add the previous point if possible
        if (currentNavigation.length === 0 && i > 0) {
          currentNavigation.push(points[i-1]); // Add the preceding point (pointId(a)-1)
        }
        currentNavigation.push(points[i]);
      } else {
        // If we have a gap of more than 1 day, end the current navigation
        if (currentNavigation.length > 0) {
          // Process the current navigation
          processNavigation(navigations, currentNavigation);
          
          // Start a new navigation with the current point
          currentNavigation = [points[i]];
        }
      }
    }
    
    // Don't forget to process the last navigation if it exists
    if (currentNavigation.length > 0) {
      processNavigation(navigations, currentNavigation);
    }
    
    // Helper function to process a navigation and add it to the navigations array
    function processNavigation(navigations, navPoints) {
      if (navPoints.length < 2) return;
      
      // Calculate total distance for this navigation
      let totalDistance = 0;
      
      // Make sure we include the distance from the preceding point (pointId(a)-1)
      for (let j = 0; j < navPoints.length - 1; j++) {
        const currentPoint = navPoints[j];
        const nextPoint = navPoints[j + 1];
        
        if (currentPoint.lat && currentPoint.long && nextPoint.lat && nextPoint.long) {
          const distance = calculateDistance(
            currentPoint.lat, 
            currentPoint.long, 
            nextPoint.lat, 
            nextPoint.long
          );
          totalDistance += distance;
        }
      }
      
      // Calculate duration and add one day as requested
      const durationDays = Math.ceil((new Date(navPoints[navPoints.length - 1].date) - 
                                    new Date(navPoints[0].date)) / (1000 * 60 * 60 * 24));
      
      navigations.push({
        startPoint: {
          entry_id: navPoints[0].entry_id,
          description: navPoints[0].description,
          date: navPoints[0].date,
          coordinates: [navPoints[0].lat, navPoints[0].long]
        },
        endPoint: {
          entry_id: navPoints[navPoints.length - 1].entry_id,
          description: navPoints[navPoints.length - 1].description,
          date: navPoints[navPoints.length - 1].date,
          coordinates: [navPoints[navPoints.length - 1].lat, navPoints[navPoints.length - 1].long]
        },
        pointCount: navPoints.length,
        totalDistance: totalDistance.toFixed(2),
        durationDays: durationDays,
        unit: "Nm"
      });
    }
    
    // Sort navigations by total distance in descending order and get top 10
    navigations.sort((a, b) => parseFloat(b.totalDistance) - parseFloat(a.totalDistance));
    const topNavigations = navigations.slice(0, 10);
    
    // Calculate some additional statistics
    const longestByDistance = navigations.length > 0 ? navigations[0] : null;
    const longestByDuration = [...navigations].sort((a, b) => b.durationDays - a.durationDays)[0] || null;
    
    const result = {
      navigations: topNavigations,
      stats: {
        totalNavigations: navigations.length,
        longestByDistance: longestByDistance,
        longestByDuration: longestByDuration
      }
    };
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating longest continuous navigations", 
      error: error.message 
    });
  }
};
// End Plus longues nav sans escale------------------------------------------------------------------------------------


// Plus longues escales------------------------------------------------------------------------------------------------
exports.getLongestStops = (req, res) => {
  try {
    const points = getTripData();
    
    // Filter out points with entry_id between 321 and 325
    const filteredPoints = points.filter(point => 
      !(point.entry_id >= 321 && point.entry_id <= 325)
    );
    
    // Sort points by date
    filteredPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const stops = [];
    
    // Helper function to check if two dates are more than 1 day apart
    const isStop = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 1;
    };
    
    // Helper function to calculate duration in years, months, weeks and days
    const calculateDuration = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calculate total days
      const diffTime = Math.abs(end - start);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calculate years, months, weeks and remaining days
      const years = Math.floor(totalDays / 365);
      let remainingDays = totalDays % 365;
      
      const months = Math.floor(remainingDays / 30);
      remainingDays = remainingDays % 30;
      
      const weeks = Math.floor(remainingDays / 7);
      remainingDays = remainingDays % 7;
      
      const days = remainingDays;
      
      return {
        totalDays,
        years,
        months,
        weeks,
        days,
        formatted: `${years > 0 ? years + ' an(s), ' : ''}${months > 0 ? months + ' mois, ' : ''}${weeks > 0 ? weeks + ' semaine(s), ' : ''}${days > 0 ? days + ' jour(s)' : ''}`
      };
    };
    
    // Find stops (escales)
    for (let i = 0; i < filteredPoints.length - 1; i++) {
      const currentPoint = filteredPoints[i];
      const nextPoint = filteredPoints[i + 1];
      
      // Log for debugging
      console.log(`Checking points: ${currentPoint.entry_id} (${currentPoint.date}) -> ${nextPoint.entry_id} (${nextPoint.date})`);
      
      if (isStop(currentPoint.date, nextPoint.date)) {
        // Calculate departure date (nextPoint date minus 1 day)
        const departureDate = new Date(nextPoint.date);
        departureDate.setDate(departureDate.getDate() - 1);
        
        // Calculate duration
        const duration = calculateDuration(currentPoint.date, departureDate.toISOString().split('T')[0]);
        
        // Log for debugging
        console.log(`Found stop at ${currentPoint.description}, duration: ${duration.totalDays} days`);
        
        stops.push({
          startPoint: {
            entry_id: currentPoint.entry_id,
            description: currentPoint.description,
            date: currentPoint.date,
            coordinates: [currentPoint.lat, currentPoint.long]
          },
          departureDate: departureDate.toISOString().split('T')[0],
          duration: duration,
          location: currentPoint.description || "Unknown location"
        });
      }
    }
    
    // Sort stops by duration in descending order and get top 10
    stops.sort((a, b) => b.duration.totalDays - a.duration.totalDays);
    const longestStops = stops.slice(0, 10);
    
    // Log the result for debugging
    console.log(`Found ${stops.length} stops in total, returning top ${longestStops.length}`);
    console.log("Longest stop:", longestStops[0]);
    
    res.status(200).json({
      stops: longestStops,
      totalStops: stops.length
    });
  } catch (error) {
    console.error("Error in getLongestStops:", error);
    res.status(500).json({ 
      message: "Error calculating longest stops", 
      error: error.message 
    });
  }
};
// End Plus longues escales------------------------------------------------------------------------------------------------
// End Plus longue escales------------------------------------------------------------------------------------------------