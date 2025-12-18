import React from "react";
import "./LandingPage.css";
import { useDispatch } from "react-redux";
import { navigateTo } from "../store/actions/navigationActions";
import SousVoile from "../assets/sous_voiles_2.jpg";
// DisableScrollZoom utility removed from this page (unused)

const LandingPage = () => {
    const dispatch = useDispatch();

    const handleEnterApp = () => {
        // Navigate to dashboard using Redux
        dispatch(navigateTo('dashboard'));
    };

    return (
        <div className="landing-page">

            {/* Croix exit en haut à droite */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 9999 }}>
                <button
                    onClick={() => {
                        // If running in Electron, use the exposed API to close the native window.
                        if (window.closeElectronWindow) {
                            window.closeElectronWindow();
                        } else {
                            // Fallback for browsers: attempt to close the tab/window.
                            window.close();
                        }
                    }}
                    style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        fontSize: 28,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    title="Quitter l'application"
                >
                    &#10005;
                </button>
            </div>
            {/* exit overlay removed — exit button closes immediately */}

            <div className="boat-image-container">
                <img src={SousVoile} alt="Boat" className="Landingimage" />
                <div className="welcome-message">
                    <p className="paragaphe1">Livre De Bord 1997 - 2012</p>
                    <div className="text1" >
                        <p className="paragraphe2" >Bienvenue dans votre</p>
                        <p className="paragraphe2" >journal de navigation numérique de</p>
                    </div>
                    <p className="paragaphe1">Hakuna Matata</p>
                    <div className="text2" >
                        <p className="paragraphe2" > Explorez les voyages,</p>
                        <p className="paragraphe2" >découvrez les destinations</p>
                        <p className="paragraphe2" > et revivez les aventures en mer.</p>
                    </div>
                    <div className="button-container">
                        <button onClick={handleEnterApp} className="enter-button">
                            Embarquez ici
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

