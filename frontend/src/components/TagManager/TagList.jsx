import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayTag from "./DisplayTag";
import TagSelector from "./TagSelector";
import { addTagToPicture, removeTagFromPicture } from "../../store/actions/pictureTagsActions";
import styles from "./TagManager.module.css";

const TagList = ({ pictureId }) => {
    const [showTagSelector, setShowTagSelector] = useState(false);

    const dispatch = useDispatch();
    const pictureTagsState = useSelector((state) => state.pictureTags);

    // Get tags for the current picture
    const pictureTags = pictureTagsState.pictureTagsMap[pictureId] || [];

    const handleAddTagClick = () => {
        setShowTagSelector(!showTagSelector);
    };

    const handleTagsChange = (newSelectedTags) => {
        // Find which tags were added (comparing to current pictureTags)
        const currentTagIds = pictureTags.map(tag => tag.id);
        // eslint-disable-next-line no-unused-vars
        // const newTagIds = newSelectedTags.map(tag => tag.id);

        // Find tags that were added
        const addedTags = newSelectedTags.filter(tag => !currentTagIds.includes(tag.id));

        // Add each new tag to the picture
        addedTags.forEach(tag => {
            dispatch(addTagToPicture(pictureId, tag.id))
                .catch(err => console.error(`Error adding tag ${tag.id} to picture ${pictureId}:`, err));
        });

        setShowTagSelector(false);
    };

    const handleRemoveTag = (tagId) => {
        dispatch(removeTagFromPicture(pictureId, tagId))
            .catch(err => console.error(`Error removing tag ${tagId} from picture ${pictureId}:`, err));
    };

    return (
        <div className={styles.tagListContainer}>
            <div className={styles.tagListHeader}>
                <h4 className={styles.tagListTitle}>Tags</h4>
                <button
                    onClick={handleAddTagClick}
                    className={styles.addTagButton}
                >
                    {showTagSelector ? "Cancel" : "+ Add Tag"}
                </button>
            </div>

            {showTagSelector && (
                <div className={styles.tagSelectorWrapper}>
                    <TagSelector
                        selectedTags={pictureTags}
                        onChange={handleTagsChange}
                    />
                </div>
            )}

            <div className={styles.tagsContainer}>
                {pictureTagsState.loading ? (
                    <div className={styles.loadingMessage}>Loading tags...</div>
                ) : pictureTagsState.error ? (
                    <div className={styles.errorMessage}>{pictureTagsState.error}</div>
                ) : pictureTags.length === 0 ? (
                    <div className={styles.noTagsMessage}>No tags for this picture</div>
                ) : (
                    <div className={styles.tagsList}>
                        {pictureTags.map(tag => (
                            <DisplayTag
                                key={tag.id}
                                tag={tag}
                                onRemove={handleRemoveTag}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagList;

