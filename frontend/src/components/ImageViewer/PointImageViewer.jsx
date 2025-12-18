import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPictureByPointId } from "../../store/actions/picturesActions";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./PointImageViewer.css";


const PointImageViewer = ({ open, pointId, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Nettoyage : zoom inutilisé
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const dispatch = useDispatch();
    const { items: pictures, loading, error } = useSelector(state => state.pictures);

    useEffect(() => {
        if (open && pointId) {
            setCurrentIndex(0);
            // Nettoyage : setZoom inutilisé
            dispatch(fetchPictureByPointId(pointId));
        }
    }, [open, pointId, dispatch]);

    useEffect(() => {
        if (pictures && pictures.length > 0) {
            //setZoom(pictures[currentIndex]?.zoom || 1);
            // Nettoyage : setZoom inutilisé
        }
    }, [pictures, currentIndex]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!open) return null;

    const handlePrev = () => setCurrentIndex((currentIndex - 1 + pictures.length) % pictures.length);
    const handleNext = () => setCurrentIndex((currentIndex + 1) % pictures.length);
    // Nettoyage : fonctions zoom inutilisées

    // Responsive window size
    const responsiveWidth = Math.min(windowSize.width * 1.15, 1936);
    const responsiveHeight = Math.min(windowSize.height * 1.089, 1452);

    // Calcul image max size
    // Nettoyage : headerHeight, descriptionHeight, padding inutilisés
    // Nettoyage : maxImgWidth et maxImgHeight inutilisés

    return (
        <div className="pointimageviewer-window" style={{ width: responsiveWidth, height: responsiveHeight }}>
            <div className="pointimageviewer-header">
                <div className="pointimageviewer-header-left">
                    Image: {pictures.length > 0 ? `${currentIndex + 1} / ${pictures.length}` : null}
                </div>

                <div className="pointimageviewer-header-right">
                    <IconButton onClick={onClose} title="Fermer">
                        <CloseIcon className="pointimageviewer-exit-icon" />
                    </IconButton>
                </div>
            </div>
            <div className="pointimageviewer-content" style={{ overflowY: 'visible', overflow: 'visible' }}>
                {loading && <div>Chargement...</div>}
                {error && <div>Erreur: {error}</div>}
                {!loading && pictures.length > 0 && (
                    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {pictures.length > 1 && (
                            <button onClick={handlePrev} className="pointimageviewer-navigation-button nav-left" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}><NavigateBeforeIcon /></button>
                        )}
                        <div className="pointimageviewer-image-area">
                            <img
                                src={`http://localhost:5000/images/${pictures[currentIndex].imageName}`}
                                alt={pictures[currentIndex].imageDescription || "Image"}
                                className="pointImageViewer-displayed-image"
                            />
                        </div>
                        {pictures.length > 1 && (
                            <button onClick={handleNext} className="pointimageviewer-navigation-button nav-right" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}><NavigateNextIcon /></button>
                        )}
                    </div>
                )}
                {!loading && pictures.length > 0 && (
                    <div className="pointimageviewer-scrollable-description" style={{ maxHeight: '135px', overflowY: 'auto', width: '95%', textAlign: 'center', marginTop: '30px' }}>
                        <div className="pointimageviewer-image-title">{pictures[currentIndex]?.title}</div>
                        <div className="pointimageviewer-image-description">{pictures[currentIndex]?.imageDescription}</div>
                    </div>
                )}
                {!loading && pictures.length === 0 && <div>Aucune image disponible.</div>}

            </div>
        </div>
    );
}

export default PointImageViewer;
