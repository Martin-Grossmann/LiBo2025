import React from "react";
import "./LandingPage.css";
import { useDispatch } from "react-redux";
import { navigateTo } from "../store/actions/navigationActions";
import SousVoile from "../assets/sous_voiles_2.jpg";
// DisableScrollZoom removed from this page (not used)

const LandingPage = () => {
    const dispatch = useDispatch();

    const handleEnterApp = () => {
        // Navigate to dashboard using Redux
        dispatch(navigateTo('dashboard'));
    };

    // exit overlay removed — exit button will close immediately

    return (
    <div className="landing-page" style={{ zoom: 0.9 }}> 
            {/* Croix exit en haut à droite + contrôles plein écran */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 9999, display: 'flex', gap: 8 }}>
                {/* Enter fullscreen */}
                <button
                    onClick={async () => {
                        try {
                            if (window.electronAPI?.setFullscreen) {
                                window.electronAPI.setFullscreen(true);
                            } else {
                                const el = document.documentElement;
                                if (el.requestFullscreen) await el.requestFullscreen();
                                else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
                                else if (el.msRequestFullscreen) el.msRequestFullscreen();
                            }
                        } catch (e) {
                            console.warn('Could not enter fullscreen', e);
                        }
                    }}
                    style={{
                        color: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        fontSize: 18,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        lineHeight: '40px',
                        padding: 0,
                        background: 'white'
                    }}
                    title="Activer plein écran"
                >
                    <span style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>⛶</span>
                </button>

                {/* Exit fullscreen */}
                <button
                    onClick={async () => {
                        try {
                            if (window.electronAPI?.setFullscreen) {
                                window.electronAPI.setFullscreen(false);
                            } else {
                                if (document.fullscreenElement) {
                                    if (document.exitFullscreen) await document.exitFullscreen();
                                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                                    else if (document.msExitFullscreen) document.msExitFullscreen();
                                }
                            }
                        } catch (e) {
                            console.warn('Could not exit fullscreen', e);
                        }
                    }}
                    style={{
                        color: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        fontSize: 18,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        lineHeight: '40px',
                        padding: 0,
                        background: 'white'
                    }}
                    title="Quitter plein écran"
                >
                    <span style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>⤢</span>
                </button>

                {/* Quitter l'application */}
                <button
                    onClick={() => {
                        if (window.closeElectronWindow) {
                            window.closeElectronWindow();
                        } else {
                            window.close();
                        }
                    }}
                    style={{                        
                        color: 'black',
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
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        lineHeight: '40px',
                        padding: 0,
                        background: 'white'
                    }}
                    title="Quitter l'application"
                >
                    <span style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&#10005;</span>
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

