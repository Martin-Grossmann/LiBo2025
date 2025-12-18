const express = require("express");
const router = express.Router();
const pictureTagController = require("../controllers/pictureTagController");

// Get all picture-tag relationships
router.get("/", pictureTagController.getAllPictureTags);

// Get all tags for a specific picture
router.get("/picture/:pictureId", pictureTagController.getTagsForPicture);

// Get all pictures for a specific tag
router.get("/tag/:tagId", pictureTagController.getPicturesForTag);

// Add a tag to a picture
router.post("/", pictureTagController.addTagToPicture);

// Remove a tag from a picture
router.delete("/:pictureId/:tagId", pictureTagController.removeTagFromPicture);

// Search pictures by tag(s)
router.post("/search", pictureTagController.searchPicturesByTags);

module.exports = router;