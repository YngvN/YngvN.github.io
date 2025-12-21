import React from 'react';
import './timeline.scss';

type TimelineControlProps = {
    currentTime: number;
    duration: number;
    onSeek: (timeSeconds: number) => void;
    isEnabled: boolean;
};

function formatTime(totalSeconds: number) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const TimelineControl: React.FC<TimelineControlProps> = ({
    currentTime,
    duration,
    onSeek,
    isEnabled,
}) => {
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
    const safeCurrent = Number.isFinite(currentTime) && currentTime > 0 ? currentTime : 0;
    const progressLabel = `${formatTime(safeCurrent)} / ${formatTime(safeDuration)}`;

    return (
        <label className={`music-timeline music-control-pill${isEnabled ? '' : ' is-disabled'}`}>
            <span className="music-timeline__label">Timeline</span>
            <input
                type="range"
                min={0}
                max={safeDuration}
                step={0.01}
                value={Math.min(safeCurrent, safeDuration)}
                onChange={(event) => onSeek(Number(event.target.value))}
                disabled={!isEnabled}
                aria-label="Timeline"
            />
            <span className="music-timeline__time" aria-hidden="true">
                {progressLabel}
            </span>
        </label>
    );
};

export default TimelineControl;
