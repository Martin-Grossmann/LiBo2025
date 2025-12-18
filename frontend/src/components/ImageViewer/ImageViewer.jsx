import React from "react";
import "./ImageViewer.css";
import PictureDisplay from "../PictureDisplay/PictureDisplay";

const ImageViewer = ({ pictureId }) => {
    return (
        <div className="image-viewer">
            <PictureDisplay
                initialPictureId={pictureId}
                showInputSection={true}  // Hide the input section
            />
        </div>
    );
};

export default ImageViewer;

