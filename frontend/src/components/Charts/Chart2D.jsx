import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Chart2D.css";
import HelpWindows from "../HelpWindows/HelpWindows2D";
import L from "leaflet"; // Explication Leaflet: https://leafletjs.com/examples/quick-start/
import { useSelector, useDispatch } from "react-redux";
import { isValidCoordinate } from "../../utilities/chart2DHelper";
import PointMarker from "./PointMarker";
import DisableScrollZoom from "../../utilities/DisableScrollZoom";
import DateFilter from "../Filters/DateFilter"; // Ajout de l'import DateFilter
import YearFilter from "../Filters/YearFilter";
import SoloFilter2D from "../Filters/SoloFilter2D";
import PointImageViewer from "../ImageViewer/PointImageViewer";
import PointVideoViewer from "../VideoViewer/PointVideoViewer";

//import Imagemap from "../../assets/map.png";
//import Imagesatelite from "../../assets/satelite.png";

// Fix Leaflet icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


// Fonction pour détecter si les points traversent l'antiméridian
const detectAntiMeridianCrossing = (points) => {
  if (!points || points.length < 2) return false;

  let hasPositive = false;
  let hasNegative = false;
  let maxDiff = 0;

  // Vérifier si nous avons des longitudes positives et négatives
  points.forEach((point) => {
    const lng = Number(point.long);
    if (lng >= 0) hasPositive = true;
    if (lng < 0) hasNegative = true;
  });

  // Calculer la différence maximale entre deux points consécutifs
  for (let i = 1; i < points.length; i++) {
    const prevLng = Number(points[i - 1].long);
    const currLng = Number(points[i].long);
    const diff = Math.abs(prevLng - currLng);
    maxDiff = Math.max(maxDiff, diff);
  }

  return hasPositive && hasNegative && maxDiff > 180;
};

// Fonction pour détecter si les points traversent le méridien standard (0°)
const detectMeridianCrossing = (points) => {
  if (!points || points.length < 2) return false;

  let hasPositive = false;
  let hasNegative = false;
  let maxDiff = 0;

  // Vérifier si nous avons des longitudes positives et négatives
  points.forEach((point) => {
    const lng = Number(point.long);
    if (lng >= 0) hasPositive = true;
    if (lng < 0) hasNegative = true;
  });

  // Calculer la différence maximale entre deux points consécutifs
  for (let i = 1; i < points.length; i++) {
    const prevLng = Number(points[i - 1].long);
    const currLng = Number(points[i].long);
    const diff = Math.abs(prevLng - currLng);
    maxDiff = Math.max(maxDiff, diff);
  }

  return hasPositive && hasNegative && maxDiff < 180;
};

// Composant pour ajuster la vue de la carte - optimisé pour une mise en page plus rapide
const MapAdjuster = ({ points, crossesMeridian, crossesAntiMeridian }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0 || !map || !map._loaded) return;

    // Réduire le délai pour un rendu plus rapide
    const timer = setTimeout(() => {
      try {
        if (!map || !map._loaded) return;

        // Calculer les limites pour le zoom
        let bounds;
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

        points.forEach(point => {
          const lat = Number(point.lat);
          let lng = Number(point.long);

          // Ajuster les longitudes si nécessaire
          if (crossesAntiMeridian && lng < 0) lng += 360;

          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });

        bounds = L.latLngBounds(
          [minLat, minLng],
          [maxLat, maxLng]
        );

        if (bounds && bounds.isValid()) {
          map.invalidateSize();
          map.fitBounds(bounds, {
            padding: [30, 30], // Réduire le padding pour un zoom plus précis
            maxZoom: 10,
            animate: true,
            duration: 0.5 // Réduire la durée de l'animation
          });
        }
      } catch (error) {
        console.error("Error adjusting map view:", error);
      }
    }, 200); // Délai réduit pour un rendu plus rapide

    return () => clearTimeout(timer);
  }, [map, points, crossesMeridian, crossesAntiMeridian]);

  return null;
};

// Composant pour tracker les coordonnées de la souris
const MouseTracker = ({ setMouseCoords, setMousePosition, setShowCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMouseMove = (e) => {
      const { lat, lng } = e.latlng;
      const { x, y } = e.containerPoint;

      setMouseCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      setMousePosition({ x: x + 10, y: y - 30 }); // Offset pour positionner au-dessus du curseur
      setShowCoords(true);
    };

    const handleMouseOut = () => {
      setShowCoords(false);
    };

    map.on('mousemove', handleMouseMove);
    map.on('mouseout', handleMouseOut);

    return () => {
      map.off('mousemove', handleMouseMove);
      map.off('mouseout', handleMouseOut);
    };
  }, [map, setMouseCoords, setMousePosition, setShowCoords]);

  return null;
};

// Bouton pour zoomer sur tous les points
const ZoomToAllButton = ({ points, crossesMeridian, crossesAntiMeridian }) => {
  const map = useMap();

  const handleZoomToAll = () => {
    if (!points || points.length === 0) return;

    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

    points.forEach(point => {
      const lat = Number(point.lat);
      let lng = Number(point.long);

      // Ajuster les longitudes si nécessaire
      if (crossesAntiMeridian && lng < 0) lng += 360;

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    const bounds = L.latLngBounds(
      [minLat, minLng],
      [maxLat, maxLng]
    );

    map.fitBounds(bounds, {
      padding: [10, 10],
      animate: true,
      duration: 0.5 // Animation plus rapide
    });
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

const Chart2D = ({ mapConfig, onBack }) => {
  // Ajout pour PointVideoViewer global
  const [videoViewerOpen, setVideoViewerOpen] = useState(false);
  const [videoViewerPointId, setVideoViewerPointId] = useState(null);
  // État pour afficher/masquer le PhotoContainer d'aide
  const [showPhotoContainer, setShowPhotoContainer] = useState(false); // false = fermé par défaut
  // Ajout pour PointImageViewer global
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerPointId, setImageViewerPointId] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  // const [mapKey, setMapKey] = useState(0); // supprimé car inutilisé
  const [isButton, setsIsButton] = useState(false);
  const [isButtonState, setIsButtonState] = useState(false);
  const [isbuttonText, setIsButtonText] = useState("Maptype: Satelite");
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [isfilterButton, setIsFilterButton] = useState("");
  const [soloOnly, setSoloOnly] = useState(false);
  const [resetDateFilterFlag, setResetDateFilterFlag] = useState(false);
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState('all');

  // Mouse coordinates tooltip state
  const [mouseCoords, setMouseCoords] = useState({ lat: 0, lng: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCoords, setShowCoords] = useState(false);
  //console.log("isfilterButton: ", isfilterButton);

  // Récupérer les points depuis le Redux store
  const { items: points } = useSelector((state) => state.points);
  const pointsKey = useMemo(() => JSON.stringify(points.map(p => p.entry_id)), [points]);


  React.useEffect(() => {
    if (window.electronZoom) {

    }
  }, []);

  // Quand soloOnly est activé, on recharge tous les points, on force l'année à 'all' et on reset le filtre date
  useEffect(() => {
    if (soloOnly) {
      if (selectedYear !== 'all') setSelectedYear('all');
      dispatch(require('../../store/actions/pointsActions').fetchPoints());
      setResetDateFilterFlag(true); // Demande à DateFilter de se reset
    }
  }, [soloOnly, dispatch, selectedYear]);

  // Permet à DateFilter de se reset une seule fois
  const handleDateFilterReset = () => {
    setResetDateFilterFlag(false);
  };

  const ToggleHandler = () => {
    setsIsButton(!isButton);
    setIsButtonState(!isButtonState)
    setIsButtonText(!isButtonState ? "Maptype: Map" : "Maptype: Satelite");
    setIsSatelliteView(prevValue => !prevValue);
  }

  // Force map re-creation when points change (year changes)
  // useEffect(() => {
  //   setMapKey(prevKey => prevKey + 1);
  // }, [pointsKey]);

  //Force map re-creation when map type changes
  // useEffect(() => {
  //   setMapKey(prevKey => prevKey + 1);
  // }, [isSatelliteView]);

  // Charger les points au chargement du composant - optimisé
  useEffect(() => {
    // Marquer la carte comme prête immédiatement
    setMapReady(true);
  }, []);

  // Filter valid points for rendering
  // Si soloOnly est activé, on affiche tous les points solo (toutes années confondues)
  const validPoints = useMemo(() => {
    if (soloOnly) {
      return points.filter(point => point && isValidCoordinate(point.lat, point.long) && point.solo);
    }
    return points.filter(point => point && isValidCoordinate(point.lat, point.long));
  }, [points, soloOnly]);

  // Détecter si les points traversent le méridien
  const crossesMeridian = useMemo(() =>
    detectMeridianCrossing(validPoints),
    [validPoints]);

  // Détecter si les points traversent l'antiméridien
  const crossesAntiMeridian = useMemo(() =>
    !crossesMeridian && detectAntiMeridianCrossing(validPoints),
    [validPoints, crossesMeridian]);

  // Préparer les points pour l'affichage
  const displayPoints = useMemo(() => {
    if (crossesAntiMeridian) {
      return validPoints.map((point) => ({
        ...point,
        displayLng: Number(point.long) < 0 ? Number(point.long) + 360 : Number(point.long),
      }));
    }
    return validPoints;
  }, [validPoints, crossesAntiMeridian]);

  if (!mapReady) {
    return <div className="loading">Chargement de la carte...</div>;
  }

  return (
    <div id="Chart-2d_Conainer" className="chart-2d-container">
      <DisableScrollZoom />

      {/* HelpWindow (PhotoContainer) Popup - OUTSIDE HEADER for overlay */}
      <HelpWindows open={showPhotoContainer} onClose={() => setShowPhotoContainer(false)} />
      {/* PointVideoViewer global overlay */}
      <PointVideoViewer open={videoViewerOpen} pointId={videoViewerPointId} onClose={() => setVideoViewerOpen(false)} />

      <header id="Chart-2dHeader" className="header-2D">
        <p className="header-text-2D">Carte du Monde 2D</p>

        <div className="filter-Main-Container">

          <div className="ChartFilterSymbolHolder">
            <button onClick={() => setIsFilterButton(isfilterButton === "" ? "on" : "")} className="ChartFilterHolder" title="Afficher les filtres" type="button" aria-expanded="false" aria-haspopup="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform: rotate(0deg); transition: transform 0.2s;"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon></svg>
              {isfilterButton === "" ? "Filters On" : "Filters Off"}
            </button>
          </div>


          <div id="year-date-filter-container" className={isfilterButton ? "year-date-filter-containerON" : "year-date-filter-containerOFF"}>
            <YearFilter selectedYear={selectedYear} setSelectedYear={setSelectedYear} setSoloOnly={setSoloOnly} />
            <DateFilter setSoloOnly={setSoloOnly} resetFilter={resetDateFilterFlag} onResetHandled={handleDateFilterReset} />
            <SoloFilter2D soloOnly={soloOnly} setSoloOnly={setSoloOnly} />
          </div>

        </div>


        <div id="Chart/Map-container" className="ChartMapContainer">
          <p className="button-2D-Help" onClick={() => { console.log('Help click'); setShowPhotoContainer(true); }}>
            Help
          </p>
          <p className="button-2D" onClick={ToggleHandler}>{isbuttonText}</p>
          <p className="button-2D" onClick={onBack} >Retour à Dashboard</p>
        </div>

      </header>

      <div id="Map-Container" className="map-container">
        <MapContainer
          key={`${!isSatelliteView ? 'Map' : 'Satelite'}`}
          center={crossesAntiMeridian ? [0, 180] : [0, 0]}
          zoom={2}
          zoomSnap={0.1}
          zoomDelta={0.1}
          scrollWheelZoom={true}
          className="leaflet-map"
          worldCopyJump={!crossesAntiMeridian}
          markerZoomAnimation={false}
        >
          {isSatelliteView ? (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          )}

          <MapAdjuster
            key={pointsKey}
            points={validPoints}
            crossesMeridian={crossesMeridian}
            crossesAntiMeridian={crossesAntiMeridian}
          />

          <MouseTracker
            setMouseCoords={setMouseCoords}
            setMousePosition={setMousePosition}
            setShowCoords={setShowCoords}
          />

          {displayPoints.map((point, index) => (
            <PointMarker
              key={point.entry_id || index}
              point={point}
              index={index}
              crossesAntiMeridian={crossesAntiMeridian}
              onViewImages={(pointId) => {
                setImageViewerPointId(pointId);
                setShowImageViewer(true);
              }}
              onViewVideo={(pointId) => {
                setVideoViewerPointId(pointId);
                setVideoViewerOpen(true);
              }}
            />
          ))}

          <ZoomToAllButton
            points={validPoints}
            crossesMeridian={crossesMeridian}
            crossesAntiMeridian={crossesAntiMeridian}
          />
        </MapContainer>

        {/* Fenêtre d'affichage des coordonnées */}
        {showCoords && (
          <div
            className="coordinates-tooltip"
            style={{
              position: 'absolute',
              left: mousePosition.x,
              top: mousePosition.y,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              pointerEvents: 'none',
              zIndex: 1000,
              whiteSpace: 'nowrap'
            }}
          >
            Lat: {mouseCoords.lat}°<br />
            Lng: {mouseCoords.lng}°
          </div>
        )}

        {/* PointImageViewer centré dans Map-Container */}
        <PointImageViewer open={showImageViewer} pointId={imageViewerPointId} onClose={() => setShowImageViewer(false)} />
      </div>
    </div>
  );
};
export default Chart2D;