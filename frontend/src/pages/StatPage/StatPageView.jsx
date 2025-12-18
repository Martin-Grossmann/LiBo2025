import React, { useState } from "react";
import StatPageAcceil from "./StatPageAcceuil"
import StatPageSpeed from "./StatPageSpeed";
import StatPageNav from "./StatPageNav"
import StatPageEscale from "./StatPageEscale"
import "./StatPageView.css";

/**
 * Ce composant sert de wrapper pour StatPageSpeed
 * Il permet de maintenir la compatibilité avec les imports existants
 * tout en utilisant le nouveau composant StatPageSpeed
 */
export default function StatPageView({ onBack }, props) {

    const StatAcceuilTitle = "Faite votre choix"
    const StatSpeedTitle = "Les 10 meilleures performances"
    const StatNavTitle = "Les 10 plus longues navigations sans escales"
    const StatEscTitle = "Les 10 plus longues escales"

    // Utilisez un seul état pour suivre la page active
    const [activePage, setActivePage] = useState("accueil");

    return (
        <div className="statViewContainer" >
            <div id="Stat-TpopBar" className="topBar">

                {/* Conteneur pour les éléments à droite */}
                <div className="rightControlsContainer">
                    <div>
                        <button className="StatViewbutton" onClick={() => setActivePage("rapidite")}>Les 10 meilleures performances</button>
                        <button className="StatViewbutton" onClick={() => setActivePage("longNav")}>Les 10 plus longs navigations</button>
                        <button className="StatViewbutton" onClick={() => setActivePage("longEsc")}>Les 10 plus longs escales</button>
                    </div>
                </div>

                {/* Conteneur pour les éléments à gauche */}
                <div className="leftControlsContainer">
                    {/* Bouton de retour */}
                    <button onClick={onBack} className="back-button">
                        Retour au Dashboard
                    </button>
                </div>

            </div>

            {/* Rendu conditionnel basé sur activePage */}
            {activePage === "accueil" && <StatPageAcceil title={StatAcceuilTitle} />}
            {activePage === "rapidite" && <StatPageSpeed title={StatSpeedTitle} />}
            {activePage === "longNav" && <StatPageNav title={StatNavTitle} />}
            {activePage === "longEsc" && <StatPageEscale title={StatEscTitle} />}

        </div >
    );
}

