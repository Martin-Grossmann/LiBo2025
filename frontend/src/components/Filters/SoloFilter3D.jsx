
import React from 'react';
import './SoloFiter.css';

const SoloFilter = ({ soloOnly, setSoloOnly, soloToAll }) => {
    const handleChange = () => {
        if (soloOnly) {
            // On décoche : retour à All + reset animation
            if (typeof soloToAll === 'function') soloToAll();
        } else {
            // On coche : active solo
            setSoloOnly(true);
        }
    };
    return (
        <div className="solo-filter-container">
            <label htmlFor="solo-toggle" className='labelSoloSelect'>Navigation solo&nbsp;: </label>
            <input
                id="solo-toggle"
                type="checkbox"
                checked={soloOnly}
                onChange={handleChange}
            />
            <span style={{ marginLeft: 0 }}>{soloOnly ? "Solo uniquement" : "Tous les points"}</span>
        </div>
    );
};

export default SoloFilter;
