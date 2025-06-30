import React from 'react';
import './DialProgress.css';
import { formatTime } from '../utils/timeUtils';

const DialProgress = ({ percentage, timeLeft }) => {
    const radius = 140;
    const circumference = radius * 2 * Math.PI;
    
    // Calculate the visible arc (300 degrees for a larger gap)
    const visibleArc = (300 / 360) * circumference;
    
    // Invert the percentage to make progress increase as time passes
    const invertedPercentage = 100 - percentage;
    const progressLength = (invertedPercentage / 100) * visibleArc;

    return (
        <div className="dial-progress">
            <svg height="340" width="340" viewBox="0 0 340 340">
                <circle
                    className="progress-background"
                    cx="170"
                    cy="170"
                    r={radius}
                    strokeWidth="25"
                    strokeDasharray={`${visibleArc} ${circumference}`}
                />
                <circle
                    className="progress-ring"
                    cx="170"
                    cy="170"
                    r={radius}
                    strokeWidth="25"
                    strokeDasharray={`${progressLength} ${circumference}`}
                />
            </svg>
            <div className="timer-display">
                {formatTime(timeLeft * 1000)}
            </div>
        </div>
    );
};

export default DialProgress;