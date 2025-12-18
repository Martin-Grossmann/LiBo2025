import React, { useState, useEffect } from "react";
import "./PictureDisplay.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPictureById,
  fetchHasPicture,
  fetchPictureByPointId,
} from "../../store/actions/picturesActions";
import { fetchTags } from "../../store/actions/tagsActions";
import TagList from "../TagManager/TagList";

const PictureDisplay = ({ initialPictureId, pointId, showInputSection = true }) => {
  const [pictureId, setPictureId] = useState(initialPictureId || "");
  const [inputValue, setInputValue] = useState(initialPictureId || "");
  const [imageUrl, setImageUrl] = useState(null);

  // Redux state
  const dispatch = useDispatch();
  const picturesState = useSelector((state) => state.pictures);

  const { items, loading, error, hasPicturesInfo } = picturesState;
  const picture = items && items.length > 0 ? items[0] : null;

  // Check if point has pictures when pointId changes
  useEffect(() => {
    if (pointId) {
      dispatch(fetchHasPicture(pointId));
      dispatch(fetchPictureByPointId(pointId));
    }
  }, [dispatch, pointId]);

  // Fetch picture when pictureId changes
  useEffect(() => {
    if (pictureId) {
      dispatch(fetchPictureById(pictureId))
        .then((data) => console.log("FETCH COMPLETED:", data))
        .catch((err) => console.error("FETCH ERROR IN COMPONENT:", err));

      // Also fetch tags for this picture
      dispatch(fetchTagsForPicture(pictureId))
        .catch((err) => console.error("ERROR FETCHING TAGS:", err));
    }
  }, [dispatch, pictureId]);

  // Update imageUrl when picture changes
  useEffect(() => {
    if (picture && picture.imageName) {
      const url = `http://localhost:5000/images/${picture.imageName}`;
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  }, [picture]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPictureId(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setPictureId(inputValue);
    }
  };

  const handleAddTag = () => {
    setShowTagSelector(!showTagSelector);
  };

  const handleTagSelect = (e) => {
    setSelectedTagId(e.target.value);
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (selectedTagId && pictureId) {
      dispatch(addTagToPicture(pictureId, selectedTagId))
        .then(() => {
          setSelectedTagId("");
          setShowTagSelector(false);
        })
        .catch((err) => console.error("ERROR ADDING TAG:", err));
    }
  };

  const handleRemoveTag = (tagId) => {
    if (pictureId) {
      dispatch(removeTagFromPicture(pictureId, tagId))
        .catch((err) => console.error("ERROR REMOVING TAG:", err));
    }
  };

  // Determine if the current point has pictures
  const pointHasPicture =
    hasPicturesInfo &&
    hasPicturesInfo.pointId === parseInt(pointId) &&
    hasPicturesInfo.hasPictures;

  // Filter out tags that are already assigned to the picture
  const availableTags = allTags.filter(
    (tag) => !pictureTags.some((pt) => pt.id === tag.id)
  );

  // Add these console logs
  console.log("All tags:", allTags);
  console.log("Picture tags:", pictureTags);
  console.log("Picture tags state:", pictureTagsState);

  return (
    <div className="picture-display">
      {showInputSection && (
        <div className="picture-input-container">
          <form onSubmit={handleSubmit}>
            {pointId && (
              <div>
                {pointHasPicture ? (
                  <div>POINT HAS {hasPicturesInfo.count} PICTURE(S)</div>
                ) : (
                  <div>POINT HAS NO PICTURE</div>
                )}
              </div>
            )}
            <label htmlFor="picture-id-input">Picture ID:</label>
            <input
              id="picture-id-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter picture ID"
              className="picture-id-input"
            />
            <button type="submit" className="picture-load-button">
              Load Picture
            </button>
          </form>
        </div>
      )}

      <div className="picture-content">
        {loading ? (
          <div className="picture-loading">Loading image...</div>
        ) : error ? (
          <div className="picture-error">{error}</div>
        ) : !picture ? (
          <div className="picture-not-found">
            {pictureId
              ? "No image found"
              : "Enter a picture ID to display an image"}
          </div>
        ) : (
          <div className="picture-container">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={picture.imageDescription || "Image"}
                className="picture-image"
              />
            ) : (
              <div className="picture-not-available">
                Image data not available
              </div>
            )}
            {picture.imageDescription && (
              <div className="picture-title">{picture.imageDescription}</div>
            )}


          </div>
        )}
      </div>
    </div>
  );
};

export default PictureDisplay;
