import React from 'react';


const SoloFilter = ({ soloOnly, setSoloOnly }) => {
    return (
        <div className="solo-filter-container">
            <label htmlFor="solo-toggle" className='labelSoloSelect'>Navigation solo&nbsp;: </label>
            <input
                id="solo-toggle"
                type="checkbox"
                checked={soloOnly}
                onChange={() => setSoloOnly(prev => !prev)}
            />
            <span style={{ marginLeft: 0 }}>{soloOnly ? "Solo uniquement" : "Tous les points"}</span>
        </div>
    );
};

export default SoloFilter;
