import React, { useEffect, useState } from 'react';
import './ScaledContent.css';

const ScaledContent = ({ children }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            const targetWidth = 1920;
            const targetHeight = 1080;
            const widthScale = window.innerWidth / targetWidth;
            const heightScale = window.innerHeight / targetHeight;

            const newScale = Math.min(widthScale, heightScale);
            setScale(newScale);
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);

        return () => {
            window.removeEventListener('resize', calculateScale);
        };
    }, []);

    return (
        <div className="scaled-content-wrapper">
            <div
                className="scaled-content"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center top',
                    width: '1920px',
                    height: '1080px',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScaledContent;