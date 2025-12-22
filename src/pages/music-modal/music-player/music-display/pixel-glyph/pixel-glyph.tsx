import React from 'react';
import './pixel-glyph.scss';

const PixelGlyph: React.FC = () => {
    return (
        <div className="pixel-glyph">
            <button
                className="pixel-glyph__button"
                type="button"
                aria-label="Pixel glyph tool"
                title="Pixel glyph tool"
            >
                Pixel
            </button>
        </div>
    );
};

export default PixelGlyph;
