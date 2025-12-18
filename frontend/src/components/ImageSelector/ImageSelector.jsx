import React, { useState, useEffect } from "react";
import "./ImageSelector.css";

const ImageSelector = ({ initialPictureId, onImageSelect }) => {
    const [inputValue, setInputValue] = useState(initialPictureId || "");
    const [pointHasPicture, setPointHasPicture] = useState(false);

    useEffect(() => {
        const fetchPointPictureInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/points/${1}/has-pictures`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setPointHasPicture(data.hasPictures);
            } catch (error) {
                console.error("Error checking if point has pictures:", error);
            }
        };

        fetchPointPictureInfo();
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onImageSelect(inputValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onImageSelect(inputValue);
        }
    };

    return (
        <div className="image-selector">
            <div className="picture-input-container">
                <form onSubmit={handleSubmit}>
                    {pointHasPicture ? <div>POINT HAS PICTURE </div> : <div>POINT HAS NO PICTURE </div>}
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
        </div>
    );
};

export default ImageSelector;