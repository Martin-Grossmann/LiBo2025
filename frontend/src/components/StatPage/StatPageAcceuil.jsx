import "./StatPageAcceuil.css"
import { useState } from "react"
import DisableScrollZoom from "../../utilities/DisableScrollZoom";
import StatPageSpeed from "./StatPageSpeed"
import StatPageNav from "./StatPageNav"
import StatPageEscale from "./StatPageEscale"
import coursVite from "../../assets/cours-vite.jpg"
import coursLongtemps from "../../assets/cours-longtemps.png"
import sieste from "../../assets/sieste.png"
import ImageFond from "../../assets/ZIC_Atlantique_788.jpg";

const StatPageAcceuil = ({ onBack, title }) => {

    //const StatAcceuilTitle = "Faite votre choix"
    const StatSpeedTitle = "Les 10 meilleures performances"
    const StatNavTitle = "Les 10 plus longues navigations sans escales"
    const StatEscTitle = "Les 10 plus longues escales"

    // Utilisez un seul état pour suivre la page active
    const [activePage, setActivePage] = useState("");


    // Fonction pour revenir à l'accueil
    const handleBackToHome = () => {
        setActivePage("");
    };


    // Si une page spécifique est active, afficher uniquement cette page
    if (activePage) {
        return (
            <>
                {activePage === "rapidite" && <StatPageSpeed onBack={handleBackToHome} title={StatSpeedTitle} />}
                {activePage === "longNav" && <StatPageNav onBack={handleBackToHome} title={StatNavTitle} />}
                {activePage === "longEsc" && <StatPageEscale onBack={handleBackToHome} title={StatEscTitle} />}
            </>
        );
    }

    // Sinon, afficher la page d'accueil
    return (
        <div className="Statistic">
            <DisableScrollZoom />

            <div>

                <div className="header-stat-acceuil">
                    <p className="header-text-stat-acceuil" >Statistic</p>
                    {/* Bouton de retour */}
                    <p onClick={onBack} className="button-stat-acceuil">
                        Retour au Dashboard
                    </p>
                </div>

                <div className="boat-image-container">
                    <img src={ImageFond} alt="ImageFond" className="ImageFond" />
                </div>

                <div id="Stat" className="stat-content" >
                    <div className="stat-content" >
                        <div className="stat-page-card">
                            <div className="stat-card-content">
                                <p className="stat-card-p">Les 10 plus...</p>
                                <p className="stat-card-p" >... rapides voyages en 24 heures</p>
                            </div>

                            <div>
                                <div className="image-container"  >
                                    <img src={coursVite} alt="coursVite" className="stat-image" onClick={() => setActivePage("rapidite")}></img>
                                </div>
                            </div>
                        </div>

                        <div className="stat-page-card">
                            <div className="stat-card-content">
                                <p className="stat-card-p">Les 10 plus...</p>
                                <p className="stat-card-p">... longues navigations sans escale</p>
                            </div>
                            <div>
                                <div className="stat-button-container"  >
                                    <img src={coursLongtemps} alt="coursLongtemps" className="stat-image" onClick={() => setActivePage("longNav")} />
                                </div>
                            </div>
                        </div>

                        <div className="stat-page-card">
                            <div className="stat-card-content">
                                <p className="stat-card-p">Les 10 plus...</p>
                                <p className="stat-card-p">... longues escales</p>
                            </div>
                            <div>
                                <div className="stat-button-container"  >
                                    <img src={sieste} alt="sieste" className="stat-image" onClick={() => setActivePage("longEsc")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default StatPageAcceuil 