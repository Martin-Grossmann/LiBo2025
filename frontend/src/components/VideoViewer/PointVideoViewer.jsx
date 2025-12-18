import React, { useState } from "react";
// Nettoyage : Button inutilisé
import {
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// Nettoyage : VideoIcon inutilisé
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoByPointId } from "../../store/actions/videosActions";
import VideoPlayer from "./VideoPlayer";
import "./PointVideoViewer.css";

/**
 * Composant pour afficher les vidéos associées à un point
 * @param {Object} props - Les propriétés du composant
 * @param {string|number} props.pointId - ID du point dont on veut afficher les vidéos
 */
const PointVideoViewer = ({ pointId, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { items: videos, loading: videosLoading } = useSelector(
    (state) => state.videos
  );

  // Charger les vidéos lorsque la fenêtre est ouverte
  React.useEffect(() => {
    if (open && pointId) {
      setError(null);
      setCurrentIndex(0);
      dispatch(fetchVideoByPointId(pointId)).catch((err) => {
        setError("Impossible de charger les vidéos");
        console.error("Error loading videos:", err);
      });
    }
  }, [open, pointId, dispatch]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
  };

  // Fonction pour construire l'URL correcte de la vidéo
  const getVideoUrl = (video) => {
    if (!video) return "";

    if (video.url && (video.url.startsWith("http") || video.url.startsWith("/"))) {
      return video.url;
    }

    if (video.videoName) {
      return `http://localhost:5000/videos/${video.videoName}`;
    }

    if (video.video_url) return video.video_url;
    if (video.file_name) return `http://localhost:5000/videos/${video.file_name}`;

    return `http://localhost:5000/api/v1/videos/${video.id}/file`;
  };

  // Fonction pour obtenir la description de la vidéo
  const getVideoDescription = (video) => {
    if (!video) return "";
    return video.videoDescription || video.description || "";
  };

  return (
    open && (
      <div className="pointvideoviewer-window">
        <div className="pointvideoviewer-header">
          <div className="pointvideoviewer-header-title">
            Vidéos {videos.length > 1 && `(${currentIndex + 1}/${videos.length})`}
          </div>
          {videos[currentIndex] && (
            <div className="pointvideoviewer-description-area">
              <Typography
                variant="subtitle1"
                className="pointvideoviewer-display-title"
              >
                {videos[currentIndex]?.title || getVideoDescription(videos[currentIndex])}
              </Typography>
              <div className="pointvideoviewer-display-metadata">
                {videos[currentIndex]?.created_at && (
                  <span>
                    Date: {new Date(videos[currentIndex].created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
          <div>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="pointvideoviewer-content">
          {videosLoading ? (
            <div className="pointvideoviewer-loading-container">
              <CircularProgress />
              <Typography variant="body2" className="pointvideoviewer-loading-text">
                Chargement des vidéos...
              </Typography>
            </div>
          ) : error ? (
            <div className="pointvideoviewer-error-container">
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            </div>
          ) : videos.length === 0 ? (
            <div className="pointvideoviewer-empty-container">
              <Typography variant="body1">
                Aucune vidéo disponible pour ce point.
              </Typography>
            </div>
          ) : (
            <div className="pointvideoviewer-display-container">
              <div className="pointvideoviewer-player-wrapper">
                {videos.length > 1 && (
                  <IconButton
                    onClick={handlePrevious}
                    className="pointvideoviewer-navigation-button pointvideoviewer-nav-prev"
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                )}

                {videos[currentIndex] && (
                  <div className="pointvideoviewer-player-area">
                    <VideoPlayer
                      key={`video-${videos[currentIndex].id}-${currentIndex}`}
                      videoUrl={getVideoUrl(videos[currentIndex])}
                    />
                  </div>
                )}

                {videos.length > 1 && (
                  <IconButton
                    onClick={handleNext}
                    className="pointvideoviewer-navigation-button pointvideoviewer-nav-next"
                  >
                    <NavigateNextIcon />
                  </IconButton>
                )}
              </div>


            </div>
          )}
        </div>
      </div>
    )
  );
};

export default PointVideoViewer;
