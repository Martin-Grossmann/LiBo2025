import React from 'react';
import './ElectronInternetNotice.css';

const ElectronInternetNotice = ({ onClose }) => (
    <div className="electron-internet-notice">
        <div className="electron-internet-notice-content">
            <p>Afin de profiter pleinement des cartes détaillées</p>
            <p>il est préférable d'être connecté à internet</p>
            <button onClick={onClose}>Compris</button>
        </div>
    </div>
);

export default ElectronInternetNotice;
