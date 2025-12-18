import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FullscreenPrompt from './components/FullscreenPrompt/FullscreenPrompt';
import './App.css';
import { enterFullscreen } from './utilities/fullscreenHelper';
import ElectronInternetNotice from './components/ElectronInternetNotice';

const App = () => {
  console.log("App ok")
  const { currentPage } = useSelector(state => state.navigation);
  // Détecter si on est sous Electron
  // Détection Electron robuste
  const isElectron = Boolean(window.isElectronApp);
  console.log("isElectron =", isElectron);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(!isElectron);
  const [showElectronNotice, setShowElectronNotice] = useState(isElectron);

  // Activer automatiquement le plein écran sous Electron
  useEffect(() => {
    if (isElectron) {
      enterFullscreen(document.documentElement).catch(() => {});
    }
  }, [isElectron]);

  // Écouteur d'événement pour détecter les changements de mode plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log("Changement de mode plein écran détecté");
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Fonction pour continuer après la demande de plein écran
  const handleContinue = () => {
    setShowFullscreenPrompt(false);
    
    // Déclencher un événement de redimensionnement après un court délai
    // pour s'assurer que tous les composants s'adaptent au plein écran
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  };

  // Render the appropriate page based on the current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app">
      {isElectron && showElectronNotice && (
        <ElectronInternetNotice onClose={() => setShowElectronNotice(false)} />
      )}
      {isElectron
        ? renderPage()
        : (showFullscreenPrompt
            ? <FullscreenPrompt onContinue={handleContinue} />
            : renderPage()
          )
      }
    </div>
  );
};

export default App;
