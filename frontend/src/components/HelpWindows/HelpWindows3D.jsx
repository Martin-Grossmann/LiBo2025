

import Help3DVideo from "../../assets/Help3D.mp4";
import React from "react";
import "./HelpWindows.css";

const HelpWindows3D = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div id="Helpwindow-Container" className="helpwindows-container">
            <div className="helpwindow-controls-top">
                <div className="helpwindow-image-counter">Aide</div>
                <div className="helpwindow-exit-controls">
                    <button
                        onClick={onClose}
                        className="helpwindow-control-button helpwindow-exit-button"
                        title="Fermer la fenêtre d'aide"
                    >
                        <span>✕</span>
                    </button>
                </div>
            </div>
            <div className="helpwindow-main-container" >
                <div style={{ textAlign: 'center', width: '90%', height: '90%', overflowY: 'auto', margin: '0 auto' }}>
                    <video
                        src={Help3DVideo}
                        controls
                        style={{
                            width: '90vw',
                            height: 'auto',
                            maxWidth: 1500,
                            maxHeight: 900,
                            borderRadius: 12,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                        }}
                        poster=""
                    >
                        Sorry, your browser does not support embedded videos.
                    </video>
                </div>
            </div>
        </div>
    );
};
export default HelpWindows3D;
