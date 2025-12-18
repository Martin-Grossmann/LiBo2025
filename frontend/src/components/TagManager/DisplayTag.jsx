import React from "react";
import styles from "./DisplayTag.module.css";

const DisplayTag = ({ tag, onRemove, clickable = false, onClick }) => {
    console.log("DisplayTag props:", { tag, onRemove, clickable, onClick });

    const handleClick = () => {
        if (clickable && onClick) {
            onClick(tag);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(tag.id);
        }
    };

    return (
        <div
            className={`${styles.tag} ${clickable ? styles.clickable : ""}`}
            style={{
                backgroundColor: tag.color,
                color: tag.textColor
            }}
            onClick={handleClick}
        >
            <span className={styles.tagName}>{tag.name}</span>
            {onRemove && (
                <button
                    className={styles.removeButton}
                    onClick={handleRemove}
                    title="Remove tag"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default DisplayTag;