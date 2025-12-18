import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags } from "../../store/actions/tagsActions";
import DisplayTag from "./DisplayTag";
import styles from "./TagSelector.module.css";

const TagSelector = ({ selectedTags = [], onChange, maxTags = null }) => {
    console.log("TAG SELECTOR ACTIVE")
    const dispatch = useDispatch();
    const { items: allTags, loading } = useSelector((state) => state.tags);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        console.log("TAG SELECTOR FETCHING ALL TAGS")
        dispatch(fetchTags());
    }, [dispatch]);


    console.log("ALL TAGS", allTags)
    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.some((t) => t.id === tag.id)) {
            if (maxTags === null || selectedTags.length < maxTags) {
                const newSelectedTags = [...selectedTags, tag];
                onChange(newSelectedTags);
            }
        }
        setSearchTerm("");
        inputRef.current.focus();
    };

    const handleTagRemove = (tagId) => {
        const newSelectedTags = selectedTags.filter((tag) => tag.id !== tagId);
        onChange(newSelectedTags);
    };

    // Filter tags based on search term and already selected tags
    const filteredTags = allTags.filter(
        (tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedTags.some((t) => t.id === tag.id)
    );

    return (
        <div className={styles.tagSelector} ref={dropdownRef}>
            <div className={styles.selectedTags}>
                {selectedTags.map((tag) => (
                    <DisplayTag
                        key={tag.id}
                        tag={tag}
                        onRemove={handleTagRemove}
                    />
                ))}
            </div>

            <div className={styles.inputContainer}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder={
                        maxTags !== null && selectedTags.length >= maxTags
                            ? "Maximum tags reached"
                            : "Search for tags..."
                    }
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    disabled={maxTags !== null && selectedTags.length >= maxTags}
                />

                {isDropdownOpen && searchTerm && (
                    <div className={styles.dropdown}>
                        {loading ? (
                            <div className={styles.loadingMessage}>Loading tags...</div>
                        ) : filteredTags.length > 0 ? (
                            <ul className={styles.tagList}>
                                {filteredTags.map((tag) => (
                                    <li
                                        key={tag.id}
                                        className={styles.tagItem}
                                        onClick={() => handleTagSelect(tag)}
                                    >
                                        <span
                                            className={styles.tagBadge}
                                            style={{
                                                backgroundColor: tag.color,
                                                color: tag.textColor
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                        <span className={styles.tagCategory}>{tag.category}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.noResults}>No matching tags found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagSelector;