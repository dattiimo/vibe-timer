import React from 'react';
import { formatTime } from '../utils/timeUtils';

const Timer = ({ timeLeft }) => {
    return (
        <div className="timer">
            <div className="time-display">{formatTime(timeLeft * 1000)}</div>
        </div>
    );
};

export default Timer;