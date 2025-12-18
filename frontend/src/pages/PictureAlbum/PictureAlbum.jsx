import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisableScrollZoom from "../../utilities/DisableScrollZoom";
import PicturesFilter from "../../components/Filters/PictureAlbumFilter";
import PictureAlbumImageViewer from "./PictureAlbumViewer";

import {
    fetchPictureAlbum,
    filterPictureAlbumByTags,
    adjustImageZoom,
    toggleAlbumPhotoViewer,
    resetPictureAlbumFilters,
} from "../../store/actions/pictureAlbumAction";
import {
    selectPictureAlbum,
    selectCurrentImage,
    selectFilteredImages,
} from "../../store/reducers/pictureAlbumReducer";
import MainImage from "../../assets/En_Mer_180.jpg";
import "./PictureAlbum.css";

const PictureAlbumPage = ({ onBack }) => {
    const dispatch = useDispatch();

    // États Redux
    const albumState = useSelector(selectPictureAlbum);
    const currentImage = useSelector(selectCurrentImage);
    const filteredImages = useSelector(selectFilteredImages);
    // Nettoyage : loading et error inutilisés supprimés

    // Zoom de l'image actuelle
    // Nettoyage : currentImageZoom inutilisé supprimé
    // Appliquer le zoom par défaut uniquement lors de l'ouverture du viewer
    useEffect(() => {
        if (albumState.showPhotoViewer && currentImage && typeof currentImage.zoom === 'number') {
            dispatch(adjustImageZoom('set', currentImage.id, currentImage.zoom));
        }
    }, [albumState.showPhotoViewer, currentImage, dispatch]);



    //

    // États locaux pour l'UI seulement
    const [isfilterButton, setIsFilterButton] = useState("");
    const [showViewer, setShowViewer] = useState(true);

    // Chargement initial des images
    useEffect(() => {
        // Reset des filtres AVANT de charger les données
        dispatch(resetPictureAlbumFilters());

        //
        dispatch(fetchPictureAlbum());

        // S'assurer que le viewer de photos est ouvert par défaut
        dispatch(toggleAlbumPhotoViewer(true));
    }, [dispatch]);

    // Gestionnaires d'événements Redux
    const handleFilterChange = ({ category, subCategory }) => {
        //
        dispatch(filterPictureAlbumByTags(category, subCategory));

        // Si le viewer est fermé ET qu'une sélection est faite (pas vide), ouvrir le viewer automatiquement
        if (!showViewer && (category || subCategory)) {
            setShowViewer(true);
        }
    };

    // Reset filter and show all images when opening viewer
    const handleOpenViewer = () => {
        dispatch(fetchPictureAlbum()); // recharge toutes les images
        setShowViewer(true);
    };

    // Fermer le viewer et remettre les filtres à zéro
    const handleCloseViewer = () => {
        setShowViewer(false);
        dispatch(resetPictureAlbumFilters());
    };

    // Gérer le toggle des filtres avec reset quand on passe en "Filters OFF"
    const handleToggleFilters = () => {
        const newFilterState = isfilterButton === "" ? "on" : "";
        setIsFilterButton(newFilterState);

        // Si on passe en mode "Filters OFF" (newFilterState === ""), reset les filtres
        if (newFilterState === "") {
            dispatch(resetPictureAlbumFilters());
        }
    };

    // Nettoyage : fonctions inutilisées supprimées

    // Image actuelle ou fallback
    // Nettoyage : displayImage non utilisé supprimé

    return (
        <div id="pictureAlbum">
            <DisableScrollZoom />

            {/* Header */}
            <div className="pictureAlbum-header">
                <p className="pictureAlbum-header-text-acceuil">Photos Album</p>

                <div id="pictureAlbum-Filter" className="pictureAlbum-Button-and-Filter-Container">
                    <div className="pictureAlbum-PhotoFilterSymbolHolder">
                        <button
                            onClick={handleToggleFilters}
                            className="pictureAlbum-Button-filterON-OFF"
                            title="Afficher les filtres"
                            type="button"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform: rotate(0deg); transition: transform 0.2s;">
                                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
                            </svg>
                            {isfilterButton === "" ? "Filters ON" : "Filters OFF"}
                        </button>
                    </div>
                    <div
                        id="pictureAlbum-Filter Main Container"
                        className={isfilterButton ? "pictureAlbum-filter-containerON" : "pictureAlbum-filter-containerOFF"}
                    >
                        <PicturesFilter onFilterChange={handleFilterChange} />
                    </div>
                </div>
                {/* Boutons viewer et retour alignés */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className="pictureAlbum-button-open-viewer" style={{ marginRight: '20px' }} onClick={handleOpenViewer}>
                        Voir Images
                    </p>
                    <p onClick={onBack} className="pictureAlbum-button-Retour">
                        Retour au Dashboard
                    </p>
                </div>
            </div>
            {/* End Header */}


            <div id="picture-album-container" className="picture-album-container">
                <div className="stat-button-container">
                    <img src={MainImage} alt="MainImage" className="pictureAlbum-ImageFond" />
                </div>

                {/* PictureAlbumImageViewer centré dans picture-album-container */}
                {showViewer && (
                    <PictureAlbumImageViewer
                        open={showViewer}
                        images={filteredImages}
                        pointId={currentImage?.id}
                        onClose={handleCloseViewer}
                    />
                )}
            </div>
        </div>
    );
};

export default PictureAlbumPage;
