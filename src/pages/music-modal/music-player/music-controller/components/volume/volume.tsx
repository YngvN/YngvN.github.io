import React from 'react';
import './volume.scss';

type VolumeControlProps = {
    value: number;
    onChange: (nextValue: number) => void;
    isEnabled: boolean;
};

const VolumeControl: React.FC<VolumeControlProps> = ({ value, onChange, isEnabled }) => {
    const normalized = Math.max(0, Math.min(1, value));
    const volumeLabel = `Volume ${Math.round(normalized * 100)}%`;

    return (
        <label className={`music-volume music-control-pill${isEnabled ? '' : ' is-disabled'}`}>
            <span className="music-volume__label">Volume</span>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={normalized}
                onChange={(event) => onChange(Number(event.target.value))}
                disabled={!isEnabled}
                aria-label={volumeLabel}
            />
        </label>
    );
};

export default VolumeControl;
