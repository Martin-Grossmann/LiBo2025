import { useEffect } from 'react';

/**
 * Component that disables scroll zooming (Ctrl+scroll or pinch zoom)
 * @returns {null} This component doesn't render anything
 */
const DisableScrollZoom = () => {
  useEffect(() => {
    // Function to prevent zoom on wheel events when Ctrl key is pressed
    const preventZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Function to prevent zoom on touch events (pinch zoom)
    const preventTouchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('touchstart', preventTouchZoom, { passive: false });
    
    // Set initial zoom level to 80%
    document.body.style.zoom = '100%';
    
    // Cleanup function
    return () => {
      document.removeEventListener('wheel', preventZoom);
      document.removeEventListener('touchstart', preventTouchZoom);
    };
  }, []);

  return null;
};

export default DisableScrollZoom;