const Point = require('../models/Point'); // Adjust based on your model structure

// Controller for date filtering operations
class DateFilterController {
  /**
   * Get points between two dates
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getPointsBetweenDates(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // Validate dates
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Both startDate and endDate are required' 
        });
      }
      
      // Validate date format and range
      if (!this.isValidDateRange(startDate, endDate)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid date range' 
        });
      }
      
      // Query database for points between dates
      const points = await Point.find({
        date: { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        }
      }).sort({ date: 1 });
      
      return res.status(200).json({
        success: true,
        count: points.length,
        data: points
      });
    } catch (error) {
      console.error('Error fetching points between dates:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * Validate date range including special cases
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {boolean} - Whether the date range is valid
   */
  isValidDateRange(startDate, endDate) {
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Basic validation
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
    
    if (start > end) {
      return false;
    }
    
    // Special case: The journey starts on July 8, 1997
    const journeyStart = new Date('1997-07-08');
    if (start < journeyStart) {
      return false;
    }
    
    // Special case: The journey ends on July 18, 2012
    const journeyEnd = new Date('2012-07-18');
    if (end > journeyEnd) {
      return false;
    }
    
    // Excluded years: 2009, 2010, 2011, 2013
    const excludedYears = [2009, 2010, 2011, 2013];
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    // Check if date range includes excluded years
    for (const year of excludedYears) {
      if (year >= startYear && year <= endYear) {
        // Need more complex logic here if you want to allow ranges that span
        // excluded years but don't include dates within those years
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Get available date ranges for the frontend
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  getAvailableDateRanges(req, res) {
    try {
      // Define the excluded years
      const excludedYears = [2009, 2010, 2011, 2013];
      
      // Available years (from 1997 to 2013, excluding the excluded years)
      const availableYears = Array.from({ length: 17 }, (_, i) => 1997 + i)
        .filter(year => !excludedYears.includes(year));
      
      // Special date constraints
      const constraints = {
        journeyStart: '1997-07-08',
        journeyEnd: '2012-07-18',
        excludedYears
      };
      
      return res.status(200).json({
        success: true,
        data: {
          availableYears,
          constraints
        }
      });
    } catch (error) {
      console.error('Error getting available date ranges:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new DateFilterController();