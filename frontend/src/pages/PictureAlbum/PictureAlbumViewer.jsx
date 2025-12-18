import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./PictureAlbumViewer.css";


const PictureAlbumImageViewer = ({ open, images = [], onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Reset index and zoom when viewer opens or images change
    useEffect(() => {
        if (open) {
            setCurrentIndex(0);
        }
    }, [open, images]);


    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!open) return null;


    const handlePrev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    const handleNext = () => setCurrentIndex((currentIndex + 1) % images.length);

    // Responsive window size
    const responsiveWidth = Math.min(windowSize.width * 1.15, 1936);
    const responsiveHeight = Math.min(windowSize.height * 1.089, 1452);

    // Calcul image max size
    // Nettoyage : headerHeight, descriptionHeight, padding inutilisés

    return (
        <div className="pictureAlbumviewer-window" style={{ width: responsiveWidth, height: responsiveHeight }}>
            <div className="pictureAlbumviewer-header">
                <div className="pictureAlbumviewer-header-left">
                    Image: {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : null}
                </div>
                <div >
                    <IconButton onClick={onClose} title="Fermer">
                        <CloseIcon className="pictureAlbumviewer-exit-icon" />
                    </IconButton>
                </div>
            </div>
            <div className="pictureAlbumviewer-content">
                {images.length > 0 ? (
                    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {images.length > 1 && (
                            <button onClick={handlePrev} className="pictureAlbumviewer-navigation-button nav-left" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}><NavigateBeforeIcon /></button>
                        )}
                        <div className="pictureAlbumviewer-image-area">
                            <img
                                src={images[currentIndex].src || images[currentIndex].imageName || images[currentIndex].url}
                                alt={images[currentIndex].description || images[currentIndex].imageDescription || "Image"}
                                className="pictureAlbumViewer-displayed-image"
                            />
                        </div>
                        {images.length > 1 && (
                            <button onClick={handleNext} className="pictureAlbumviewer-navigation-button nav-right" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}><NavigateNextIcon /></button>
                        )}
                    </div>
                ) : (
                    <div>Aucune image disponible.</div>
                )}
                {images.length > 0 && (
                    <div className="pictureAlbumviewer-description">
                        <div className="pictureAlbumViewer-image-description">{images[currentIndex]?.description || images[currentIndex]?.imageDescription}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PictureAlbumImageViewer;
