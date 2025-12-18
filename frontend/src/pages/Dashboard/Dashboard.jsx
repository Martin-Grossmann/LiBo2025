import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { navigateTo } from "../../store/actions/navigationActions";
import { fetchPoints } from "../../store/actions/pointsActions";
import DisableScrollZoom from "../../utilities/DisableScrollZoom";
import Chart3D from "../../components/Charts/Chart3D";
import Chart2D from "../../components/Charts/Chart2D";
import StatPage from "../StatPage/StatPageAcceuil";
import PictureAlbum from "../PictureAlbum/PictureAlbum";
import TagManager from "../../components/TagManager/TagManager";
import CarteMarine from "../../assets/carte-marine.png"
import Statistic from "../../assets/statistiqze.png"
import Foto from "../../assets/photos.png"
import Globe from "../../assets/Globe.png"
import ImageFond from "../../assets/En_Mer_B.jpg";

const Dashboard = () => {


    const dispatch = useDispatch();
    const [showChart3D, setShowChart3D] = useState(false);
    const [showChart2D, setShowChart2D] = useState(false);
    //const [showYears, setShowYears] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showPictures, setShowPictures] = useState(false);
    const [showTagManager, setShowTagManager] = useState(false);

    // Récupérer les points depuis le store Redux
    const points = useSelector(state => state.points.points);
    // eslint-disable-next-line no-unused-vars
    // const loading = useSelector(state => state.points.loading);
    //const error = useSelector(state => state.points.error);

    // Extraire les années uniques des points
    React.useMemo(() => {
        if (!points || points.length === 0) return [];

        // Extraire l'année de chaque point (en supposant que chaque point a une propriété date)
        const years = points.map(point => {
            // Adapter cette ligne selon la structure de vos données
            const date = new Date(point.date);
            return date.getFullYear();
        });

        // Filtrer les années uniques et les trier
        return [...new Set(years)].sort((a, b) => a - b);
    }, [points]);

    // Charger les points au chargement du composant
    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    const handleNavigateToLanding = () => {
        dispatch(navigateTo('landing'));
    };

    const toggleChart2D = () => {
        setShowChart2D(!showChart2D);
    };

    const toggleChart3D = () => {
        console.log("Toggle 3D clicked");
        setShowChart3D(!showChart3D);
    };

    const toggleStats = () => {
        console.log("Toggle Stats clicked");
        setShowStats(!showStats);
    };

    const togglePictures = () => {
        console.log("TogglePicture clicked");
        setShowPictures(!showPictures);
    };

    const toggleTagManager = () => {
        setShowTagManager(!showTagManager);
    };

    // If showChart is true, display the Chart3D component
    if (showChart3D) {
        return <Chart3D onBack={toggleChart3D} />;
    }

    // If showChart is true, display the Chart2D component
    if (showChart2D) {
        return <Chart2D onBack={toggleChart2D} />;
    }

    // If showStats is true, display the StatPage component
    if (showStats) {
        return <StatPage onBack={toggleStats} />;
    }

    // If showSPictures is true, display the StatPage component
    if (showPictures) {
        return <PictureAlbum onBack={togglePictures} />;
    }

    // If showTagManager is true, display the TagManager component
    if (showTagManager) {
        return (
            <div className="tag-manager-container">
                <div className="tag-manager-header">
                    <button onClick={toggleTagManager} className="Dashboard-back-button">
                        Retour au Dashboard
                    </button>
                </div>
                <TagManager />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <DisableScrollZoom />

            <div >

                <div className="header-dashboard">
                    <p className="header-text-dashboard" >Dashboard</p>
                    {/* Bouton de retour */}
                    <p onClick={handleNavigateToLanding} className="button-dashboard">
                        Retour à l'accueil
                    </p>
                </div>

                <div className="boat-image-container">
                    <img src={ImageFond} alt="ImageFond" className="ImageFond" />
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-card">
                        <div >
                            <h2>Navigation</h2>
                            <p>Accédez à la carte 2D</p>

                            <div className="dashboard-image-container"  >
                                <img src={CarteMarine} alt="CarteMarine" className="dashboard-image" onClick={toggleChart2D}></img>
                            </div>

                        </div>

                        <div className="action-button-container">
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div >
                            <h2>Navigation</h2>
                            <p>Accédez à l'animation 3D</p>

                            <div className="dashboard-image-container"  >
                                <img src={Globe} alt="Globe" className="dashboard-image" onClick={toggleChart3D}></img>
                            </div>

                        </div>

                        <div className="action-button-container">
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-content">
                            <h2>Statistiques</h2>
                            <p>Consultez les statistiques de vos voyages</p>
                            <div className="dashboard-image-container"  >
                                <img src={Statistic} alt="Statistic" className="dashboard-image" onClick={toggleStats}></img>
                            </div>
                        </div>
                        <div className="action-button-container">
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-content">
                            <h2>Photos</h2>
                            <p>Parcourez votre galerie de photos</p>
                            <div className="dashboard-image-container"  >
                                <img src={Foto} alt="Foto" className="dashboard-image" onClick={togglePictures} ></img>
                            </div>
                        </div>
                        <div className="action-button-container">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;


