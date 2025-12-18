import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper function to validate coordinates
const isValidCoordinate = (lat, long) => {
    return (
        lat !== undefined &&
        long !== undefined &&
        !isNaN(lat) &&
        !isNaN(long) &&
        lat >= -90 &&
        lat <= 90 &&
        long >= -180 &&
        long <= 180
    );
};

// Helper function to handle antimeridian crossing
const createBoundsForAntimeridian = (points) => {
    // Filter out points with invalid coordinates
    const validPoints = points.filter(point =>
        isValidCoordinate(point.lat, point.long)
    );

    if (validPoints.length === 0) {
        // Return a default bounds if no valid points
        return L.latLngBounds([[0, 0], [0, 0]]);
    }

    // Check if we have points crossing the antimeridian
    const longitudes = validPoints.map(point => Number(point.long));
    const minLong = Math.min(...longitudes);
    const maxLong = Math.max(...longitudes);
    
    // Check if we have points near the antimeridian
    const hasPointsNearAntimeridian = longitudes.some(long => long < -150 || long > 150);
    
    // Only apply special antimeridian handling if:
    // 1. The difference is greater than 180 degrees (crossing the antimeridian)
    // 2. AND we have at least one point near the antimeridian (-170 to +170)
    // 3. AND the points span less than 300 degrees (to avoid wrapping the whole globe)
    if (maxLong - minLong > 180 && hasPointsNearAntimeridian && maxLong - minLong < 300) {
        // Adjust coordinates for points west of the antimeridian
        const adjustedPoints = validPoints.map(point => {
            // If longitude is negative (west of antimeridian), add 360 to make it continuous
            return [Number(point.lat), Number(point.long) < 0 ? Number(point.long) + 360 : Number(point.long)];
        });

        // Create bounds with adjusted coordinates
        return L.latLngBounds(adjustedPoints);
    }
    
    // For global distribution or normal cases, use standard bounds
    // Create a proper bounds object with all points
    const bounds = L.latLngBounds(validPoints.map(point => [Number(point.lat), Number(point.long)]));
    
    // If we have a global distribution (points spanning most of the globe)
    if (maxLong - minLong > 300) {
        // Center on Greenwich (0,0) with a global view
        return L.latLngBounds([[-60, -180], [60, 180]]);
    }
    
    return bounds;
};
// Composant pour ajuster automatiquement la vue aux marqueurs
const FitBoundsToMarkers = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points && points.length > 0) {
            try {
                // Use the helper function to create appropriate bounds
                const bounds = createBoundsForAntimeridian(points);

                if (bounds.isValid()) {
                    // Ajuster la vue avec une petite marge
                    map.fitBounds(bounds, {
                        padding: [50, 50], // Ajoute une marge de 50px autour des points
                        maxZoom: 10,       // Limite le niveau de zoom maximum
                        animate: true      // Animation lors du zoom
                    });
                }
            } catch (error) {
                console.error("Error fitting bounds:", error);
            }
        }
    }, [map, points]);

    return null;
};

// Bouton de zoom sur tous les points
const ZoomToAllPointsButton = ({ points }) => {
    const map = useMap();

    const handleZoomToAll = () => {
        if (points && points.length > 0) {
            try {
                // Use the helper function to create appropriate bounds
                const bounds = createBoundsForAntimeridian(points);

                if (bounds.isValid()) {
                    map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 10,
                        animate: true
                    });
                }
            } catch (error) {
                console.error("Error zooming to all points:", error);
            }
        }
    };

    return (
        <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <button
                    title="Zoom sur tous les points"
                    onClick={handleZoomToAll}
                    className="zoom-to-all-button"
                >
                    <span role="img" aria-label="zoom">🔍</span>
                </button>
            </div>
        </div>
    );
};

// Exporter toutes les fonctions et composants
export {
    isValidCoordinate,
    createBoundsForAntimeridian,
    FitBoundsToMarkers,
    ZoomToAllPointsButton
};