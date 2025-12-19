import React from 'react';

const ChristmasDecorations = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[60] overflow-hidden">
            {/* Frost Vignette - subtle icy overlay at edges */}
            <div className="absolute inset-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_center,transparent_70%,rgba(255,255,255,0.4)_100%)] mix-blend-overlay z-10" />
        </div>
    );
};

export default ChristmasDecorations;
