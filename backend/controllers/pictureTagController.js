const fs = require("fs");
const path = require("path");

// Path to the pictureTags.json file
const pictureTagsFilePath = path.join(__dirname, "..", "data", "pictureTags.json");
const tagsFilePath = path.join(__dirname, "..", "data", "tags.json");
const picturesFilePath = path.join(__dirname, "..", "data", "pictureLegend.json");

// Helper function to read picture-tags data
const getPictureTagsData = () => {
  try {
    if (!fs.existsSync(pictureTagsFilePath)) {
      // Create the file if it doesn't exist
      fs.writeFileSync(pictureTagsFilePath, JSON.stringify([], null, 4), "utf8");
      return [];
    }
    const jsonData = fs.readFileSync(pictureTagsFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading picture-tags data:", error);
    return [];
  }
};

// Helper function to write picture-tags data
const writePictureTagsData = (data) => {
  try {
    fs.writeFileSync(pictureTagsFilePath, JSON.stringify(data, null, 4), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing picture-tags data:", error);
    return false;
  }
};

// Helper function to read tags data
const getTagsData = () => {
  try {
    const jsonData = fs.readFileSync(tagsFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading tags data:", error);
    return [];
  }
};

// Helper function to read pictures data
const getPicturesData = () => {
  try {
    const jsonData = fs.readFileSync(picturesFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading pictures data:", error);
    return [];
  }
};

// Get all tags for a specific picture
exports.getTagsForPicture = (req, res) => {
  try {
    const { pictureId } = req.params;
    const pictureTags = getPictureTagsData();
    const tags = getTagsData();
    
    // Find all tag IDs associated with this picture
    const tagIds = pictureTags
      .filter(pt => pt.pictureId === parseInt(pictureId))
      .map(pt => pt.tagId);
    
    // Get the full tag objects
    const pictureTagObjects = tags.filter(tag => tagIds.includes(tag.id));
    
    res.status(200).json({
      success: true,
      data: pictureTagObjects
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching tags for picture", 
      error: error.message 
    });
  }
};

// Get all pictures for a specific tag
exports.getPicturesForTag = (req, res) => {
  try {
    const { tagId } = req.params;
    const pictureTags = getPictureTagsData();
    const pictures = getPicturesData();
    
    // Find all picture IDs associated with this tag
    const pictureIds = pictureTags
      .filter(pt => pt.tagId === parseInt(tagId))
      .map(pt => pt.pictureId);
    
    // Get the full picture objects
    const tagPictureObjects = pictures.filter(pic => pictureIds.includes(pic.imageId));
    
    res.status(200).json({
      success: true,
      data: tagPictureObjects
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching pictures for tag", 
      error: error.message 
    });
  }
};

// Add a tag to a picture
exports.addTagToPicture = (req, res) => {
  try {
    const { pictureId, tagId } = req.body;
    
    // Validate required fields
    if (!pictureId || !tagId) {
      return res.status(400).json({ 
        success: false, 
        message: "Picture ID and Tag ID are required" 
      });
    }
    
    const pictureTags = getPictureTagsData();
    const tags = getTagsData();
    const pictures = getPicturesData();
    
    // Check if the tag exists
    const tagExists = tags.some(tag => tag.id === parseInt(tagId));
    if (!tagExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Tag not found" 
      });
    }
    
    // Check if the picture exists
    const pictureExists = pictures.some(pic => pic.imageId === parseInt(pictureId));
    if (!pictureExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Picture not found" 
      });
    }
    
    // Check if the relationship already exists
    const relationshipExists = pictureTags.some(
      pt => pt.pictureId === parseInt(pictureId) && pt.tagId === parseInt(tagId)
    );
    
    if (relationshipExists) {
      return res.status(400).json({ 
        success: false, 
        message: "This tag is already assigned to this picture" 
      });
    }
    
    // Generate a new ID
    const newId = pictureTags.length > 0 ? Math.max(...pictureTags.map(pt => pt.id)) + 1 : 1;
    
    const newPictureTag = {
      id: newId,
      pictureId: parseInt(pictureId),
      tagId: parseInt(tagId)
    };
    
    pictureTags.push(newPictureTag);
    
    if (writePictureTagsData(pictureTags)) {
      // Get the full tag object to return
      const tagObject = tags.find(tag => tag.id === parseInt(tagId));
      
      res.status(201).json({
        success: true,
        message: "Tag added to picture successfully",
        data: {
          relationship: newPictureTag,
          tag: tagObject
        }
      });
    } else {
      throw new Error("Failed to write picture-tag data");
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error adding tag to picture", 
      error: error.message 
    });
  }
};

// Remove a tag from a picture
exports.removeTagFromPicture = (req, res) => {
  try {
    const { pictureId, tagId } = req.params;
    
    const pictureTags = getPictureTagsData();
    
    // Find the relationship
    const relationshipIndex = pictureTags.findIndex(
      pt => pt.pictureId === parseInt(pictureId) && pt.tagId === parseInt(tagId)
    );
    
    if (relationshipIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "This tag is not assigned to this picture" 
      });
    }
    
    const removedRelationship = pictureTags[relationshipIndex];
    pictureTags.splice(relationshipIndex, 1);
    
    if (writePictureTagsData(pictureTags)) {
      res.status(200).json({
        success: true,
        message: "Tag removed from picture successfully",
        data: removedRelationship
      });
    } else {
      throw new Error("Failed to write picture-tag data");
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error removing tag from picture", 
      error: error.message 
    });
  }
};

// Get all picture-tag relationships
exports.getAllPictureTags = (req, res) => {
  try {
    const pictureTags = getPictureTagsData();
    res.status(200).json({
      success: true,
      data: pictureTags
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching picture-tag relationships", 
      error: error.message 
    });
  }
};

// Search pictures by tag(s)
exports.searchPicturesByTags = (req, res) => {
  try {
    const { tagIds } = req.body; // Expecting an array of tag IDs
    
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Tag IDs must be provided as a non-empty array" 
      });
    }
    
    const pictureTags = getPictureTagsData();
    const pictures = getPicturesData();
    
    // Find all picture IDs that have ALL the specified tags
    const pictureIdsWithAllTags = tagIds.reduce((acc, tagId) => {
      const pictureIdsWithTag = pictureTags
        .filter(pt => pt.tagId === parseInt(tagId))
        .map(pt => pt.pictureId);
      
      // For the first tag, initialize with all picture IDs that have this tag
      if (acc.length === 0) {
        return pictureIdsWithTag;
      }
      
      // For subsequent tags, only keep picture IDs that also have this tag
      return acc.filter(id => pictureIdsWithTag.includes(id));
    }, []);
    
    // Get the full picture objects
    const matchingPictures = pictures.filter(pic => pictureIdsWithAllTags.includes(pic.imageId));
    
    res.status(200).json({
      success: true,
      count: matchingPictures.length,
      data: matchingPictures
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error searching pictures by tags", 
      error: error.message 
    });
  }
};