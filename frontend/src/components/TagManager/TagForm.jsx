import React, { useState, useEffect } from "react";
import styles from "./TagManager.module.css";

const TagForm = ({ initialData, isEditMode, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        color: "#2596be",
        textColor: "#ffffff"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                category: initialData.category || "",
                color: initialData.color || "#2596be",
                textColor: initialData.textColor || "#ffffff"
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const categoryOptions = [
        "navigation",
        "weather",
        "maintenance",
        "crew",
        "location",
        "other"
    ];

    return (
        <div className={styles.tagForm}>
            <h3>{isEditMode ? "Edit Tag" : "Create New Tag"}</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Tag Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Select a category</option>
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="color">Tag Color:</label>
                    <div className={styles.colorPickerContainer}>
                        <input
                            type="color"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className={styles.colorPicker}
                        />
                        <span className={styles.colorValue}>{formData.color}</span>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="textColor">Text Color:</label>
                    <div className={styles.colorPickerContainer}>
                        <input
                            type="color"
                            id="textColor"
                            name="textColor"
                            value={formData.textColor}
                            onChange={handleChange}
                            className={styles.colorPicker}
                        />
                        <span className={styles.colorValue}>{formData.textColor}</span>
                    </div>
                </div>

                <div className={styles.tagPreview}>
                    <label>Preview:</label>
                    <span
                        className={styles.previewTag}
                        style={{
                            backgroundColor: formData.color,
                            color: formData.textColor
                        }}
                    >
                        {formData.name || "Tag Name"}
                    </span>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>
                        {isEditMode ? "Update Tag" : "Create Tag"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TagForm;