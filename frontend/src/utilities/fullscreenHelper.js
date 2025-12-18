// Fonction pour entrer en mode plein écran
export const enterFullscreen = (element) => {
  return new Promise((resolve, reject) => {
    try {
      const requestMethod = element.requestFullscreen || 
                           element.mozRequestFullScreen || 
                           element.webkitRequestFullscreen || 
                           element.msRequestFullscreen;
      
      if (requestMethod) {
        const promise = requestMethod.call(element);
        if (promise) {
          // Pour les navigateurs modernes qui retournent une promesse
          promise.then(resolve).catch(reject);
        } else {
          // Pour les anciens navigateurs qui ne retournent pas de promesse
          resolve();
        }
      } else {
        reject(new Error("Fullscreen API not supported"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Fonction pour quitter le mode plein écran
export const exitFullscreen = () => {
  return new Promise((resolve, reject) => {
    try {
      const exitMethod = document.exitFullscreen || 
                        document.mozCancelFullScreen || 
                        document.webkitExitFullscreen || 
                        document.msExitFullscreen;
      
      if (exitMethod) {
        const promise = exitMethod.call(document);
        if (promise) {
          promise.then(resolve).catch(reject);
        } else {
          resolve();
        }
      } else {
        reject(new Error("Fullscreen API not supported"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Fonction pour vérifier si l'application est en plein écran
export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
};

// Hook pour gérer le plein écran
export const useFullscreen = () => {
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen()) {
        await exitFullscreen();
      } else {
        await enterFullscreen(document.documentElement);
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
};