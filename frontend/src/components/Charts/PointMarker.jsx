import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import ImageIcon from "@mui/icons-material/Image";
import Button from "@mui/material/Button";
import "./PointMarker.css";
import VideoIcon from "@mui/icons-material/Videocam";

// Mapping des années aux couleurs
const YEAR_COLORS = {
    1997: "#c49a03", // Jaune
    1998: "#FF8000", // Orange
    1999: "#FF0000", // Rouge
    2000: "#7ad60a", // Vert
    2001: "#FE2E64", // Rose
    2002: "#6248e5", // Violet
    2003: "#31B404", // Vert
    2004: "#FE2E64", // Rose
    2005: "#FF8000", // Orange
    2006: "#7761e8ff", // bleu
    2007: "#c49a03", // Jaune
    2008: "#04B404", // Vert foncé
    2012: "#FF0000", // Rouge
};

// Fonction pour créer une icône colorée avec le SVG original - optimisée
const createColoredIcon = (color, hasMedia, iconSize) => {
    return L.divIcon({
        className: hasMedia ? 'media-marker-icon' : 'no-media-marker-icon',
        html: `
            <div class="${hasMedia ? 'blink-icon' : ''}" style="width:${iconSize}px; height:${iconSize}px;">
                <div class="ship-color" style="--ship-color:${color}; width:100%; height:100%;"></div>
            </div>
        `,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
        popupAnchor: [0, -iconSize / 2],
        shadowUrl: null,
        shadowSize: [0, 0]
    });
};

const PointMarker = ({ point, index, onViewImages, onViewVideo, crossesAntiMeridian }) => {
    // Get media information directly from the Redux store
    const bulkHasPicturesInfo = useSelector(
        (state) => state.pictures.bulkHasPicturesInfo
    );

    const bulkHasVideosInfo = useSelector(
        (state) => state.videos.bulkHasVideosInfo
    );

    // Get all points from Redux store
    const allPoints = useSelector((state) => state.points.items);

    // Calculate unique years outside of useMemo
    const uniqueYearsSet = new Set();
    allPoints.forEach(p => {
        if (p.date) {
            const year = new Date(p.date).getFullYear();
            uniqueYearsSet.add(year);
        } else if (p.name && /\b(19|20)\d{2}\b/.test(p.name)) {
            const match = p.name.match(/\b(19|20)\d{2}\b/);
            uniqueYearsSet.add(parseInt(match[0], 10));
        }
    });

    // If we have multiple years in the dataset, use smaller icons
    const isAllYearsSelected = uniqueYearsSet.size > 1;

    // Determine icon size based on whether all years are selected
    const ICON_SIZE = isAllYearsSelected ? 20 : 40;
    // Extraire l'année de la date du point
    const year = useMemo(() => {
        if (point.date) {
            return new Date(point.date).getFullYear();
        }
        // Si pas de date disponible, essayer d'extraire l'année du nom du point
        if (point.name && /\b(19|20)\d{2}\b/.test(point.name)) {
            const match = point.name.match(/\b(19|20)\d{2}\b/);
            return parseInt(match[0], 10);
        }
        return new Date().getFullYear(); // Année actuelle par défaut
    }, [point.date, point.name]);

    // Determine if this point has pictures
    const hasPictures = useMemo(() => {
        if (!Array.isArray(bulkHasPicturesInfo)) return false;
        const info = bulkHasPicturesInfo.find(info => info.pointId === point.entry_id);
        return info ? info.hasPictures : false;
    }, [bulkHasPicturesInfo, point.entry_id]);

    // Determine if this point has videos
    const hasVideos = useMemo(() => {
        if (!Array.isArray(bulkHasVideosInfo)) return false;
        const info = bulkHasVideosInfo.find(info => info.pointId === point.entry_id);
        return info ? info.hasVideos : false;
    }, [bulkHasVideosInfo, point.entry_id]);

    // Obtenir la couleur en fonction de l'année
    const color = useMemo(() => {
        return YEAR_COLORS[year] || "#FFFFFF"; // Blanc par défaut
    }, [year]);

    // Créer l'icône colorée
    const icon = useMemo(() => {
        const hasMedia = hasPictures || hasVideos;
        return createColoredIcon(color, hasMedia, ICON_SIZE);
    }, [color, hasPictures, hasVideos, ICON_SIZE]);

    // Calculate the position, adjusting for anti-meridian crossing if needed
    const position = [
        Number(point.lat),
        crossesAntiMeridian && Number(point.long) < 0
            ? Number(point.long) + 360
            : Number(point.long),
    ];

    return (
        <Marker
            key={point.id || index}
            position={position}
            icon={icon}
        >
            <Popup>
                <div className="my-custom-popup">
                    <strong>{point.name || "Point " + point.entry_id}</strong>
                    <br />
                    {point.description || "Aucune description"}
                    <br />
                    <Box sx={{ mt: 1 }}>
                        {hasPictures && (
                            <Button
                                startIcon={<ImageIcon />}
                                onClick={() => onViewImages(point.entry_id)}
                                variant="outlined"
                                size="small"
                                className="view-images-button"
                            >
                                VOIR LES IMAGES
                            </Button>
                        )}
                        {hasVideos && (
                            <Button
                                startIcon={<VideoIcon />}
                                onClick={() => onViewVideo(point.entry_id)}
                                variant="outlined"
                                size="small"
                                className="view-images-button"
                            >
                                VOIR LES VIDEOS
                            </Button>
                        )}
                    </Box>
                </div>
            </Popup>
        </Marker>
    );
};

export default PointMarker;
