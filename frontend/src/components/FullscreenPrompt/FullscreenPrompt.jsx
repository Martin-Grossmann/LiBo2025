import React, { useEffect, useState } from 'react';
import './FullscreenPrompt.css';
import { enterFullscreen } from '../../utilities/fullscreenHelper';

const FullscreenPrompt = ({ onContinue }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // Calculer l'échelle basée sur la résolution cible de 1920x1080
        const calculateScale = () => {
            const targetWidth = 1920;
            const targetHeight = 1080;
            const widthScale = window.innerWidth / targetWidth;
            const heightScale = window.innerHeight / targetHeight;

            // Utiliser l'échelle la plus petite pour s'assurer que tout le contenu est visible
            const newScale = Math.min(widthScale, heightScale);
            setScale(newScale);
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);

        return () => {
            window.removeEventListener('resize', calculateScale);
        };
    }, []);

    const handleEnterFullscreen = () => {

        enterFullscreen(document.documentElement)
            .then(() => {

                onContinue();
            })
            .catch(error => {
                console.error("Erreur lors de l'activation du plein écran:", error);

                onContinue();
            });
    };

    return (
        <div className="fullscreen-prompt">
            <div
                className="fullscreen-prompt-content"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    width: '500px', // Largeur fixe pour la résolution cible
                    padding: '30px',
                }}
            >
                <h2>Pour une meilleure expérience</h2>
                <p>Nous vous recommandons d'utiliser le mode plein écran.</p>
                <p>Vous pourrez quitter ce mode à tout moment en appuyant sur la touche ESC.</p>
                <div className="fullscreen-prompt-buttons">
                    <button

                        className="fullscreen-button primary"
                        onClick={handleEnterFullscreen}
                    >
                        Activer le plein écran
                    </button>
                    <button

                        className="fullscreen-button secondary"
                        onClick={onContinue}
                    >
                        Continuer sans plein écran
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FullscreenPrompt;

