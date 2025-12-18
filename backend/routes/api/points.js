const express = require('express');
const router = express.Router();
const DateFilterController = require('../../controllers/DateFilterController');

// GET /api/v1/points/date-filter
router.get('/date-filter', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both startDate and endDate are required' 
      });
    }
    
    // Convert string dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date range' 
      });
    }
    
    // Query your database for points between these dates
    // This will depend on your database schema
    const points = await Point.find({
      date: { 
        $gte: start, 
        $lte: end 
      }
    }).sort({ date: 1 });
    
    return res.json(points);
  } catch (error) {
    console.error('Error fetching points between dates:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/v1/points/date-ranges
router.get('/date-ranges', DateFilterController.getAvailableDateRanges.bind(DateFilterController));

module.exports = router;