const fs = require("fs");
const path = require("path");

// Path to the tags.json file
const tagsFilePath = path.join(__dirname, "..", "data", "tags.json");

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

// Helper function to write tags data
const writeTagsData = (data) => {
  try {
    fs.writeFileSync(tagsFilePath, JSON.stringify(data, null, 4), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing tags data:", error);
    return false;
  }
};

// Get all tags
exports.getAllTags = (req, res) => {
  try {
    const tags = getTagsData();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching tags", 
      error: error.message 
    });
  }
};

// Get tag by ID
exports.getTagById = (req, res) => {
  try {
    const { id } = req.params;
    const tags = getTagsData();
    const tag = tags.find((tag) => tag.id === parseInt(id));

    if (!tag) {
      return res.status(404).json({ 
        success: false, 
        message: "Tag not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching tag", 
      error: error.message 
    });
  }
};

// Create a new tag
exports.createTag = (req, res) => {
  try {
    const { name, category, color, textColor } = req.body;
    
    // Validate required fields
    if (!name || !category || !color) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, category, and color are required fields" 
      });
    }

    const tags = getTagsData();
    
    // Generate a new ID (max ID + 1)
    const newId = tags.length > 0 ? Math.max(...tags.map(tag => tag.id)) + 1 : 1;
    
    const newTag = {
      id: newId,
      name,
      category,
      color,
      textColor: textColor || "#ffffff" // Default to white if not provided
    };

    tags.push(newTag);
    
    if (writeTagsData(tags)) {
      res.status(201).json({
        success: true,
        message: "Tag created successfully",
        data: newTag
      });
    } else {
      throw new Error("Failed to write tag data");
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error creating tag", 
      error: error.message 
    });
  }
};

// Update a tag
exports.updateTag = (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, color, textColor } = req.body;
    
    const tags = getTagsData();
    const tagIndex = tags.findIndex((tag) => tag.id === parseInt(id));

    if (tagIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Tag not found" 
      });
    }

    // Update tag properties if provided
    if (name) tags[tagIndex].name = name;
    if (category) tags[tagIndex].category = category;
    if (color) tags[tagIndex].color = color;
    if (textColor) tags[tagIndex].textColor = textColor;

    if (writeTagsData(tags)) {
      res.status(200).json({
        success: true,
        message: "Tag updated successfully",
        data: tags[tagIndex]
      });
    } else {
      throw new Error("Failed to write tag data");
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error updating tag", 
      error: error.message 
    });
  }
};

// Delete a tag
exports.deleteTag = (req, res) => {
  try {
    const { id } = req.params;
    const tags = getTagsData();
    const tagIndex = tags.findIndex((tag) => tag.id === parseInt(id));

    if (tagIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Tag not found" 
      });
    }

    const deletedTag = tags[tagIndex];
    tags.splice(tagIndex, 1);

    if (writeTagsData(tags)) {
      res.status(200).json({
        success: true,
        message: "Tag deleted successfully",
        data: deletedTag
      });
    } else {
      throw new Error("Failed to write tag data");
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error deleting tag", 
      error: error.message 
    });
  }
};

// Get tags by category
exports.getTagsByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const tags = getTagsData();
    const filteredTags = tags.filter((tag) => tag.category === category);

    if (filteredTags.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No tags found for this category" 
      });
    }

    res.status(200).json({
      success: true,
      data: filteredTags
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching tags by category", 
      error: error.message 
    });
  }
};