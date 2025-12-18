const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// Get all tags
router.get("/", tagController.getAllTags);

// Get tag by ID
router.get("/:id", tagController.getTagById);

// Create a new tag
router.post("/", tagController.createTag);

// Update a tag
router.put("/:id", tagController.updateTag);

// Delete a tag
router.delete("/:id", tagController.deleteTag);

// Get tags by category
router.get("/category/:category", tagController.getTagsByCategory);

module.exports = router;