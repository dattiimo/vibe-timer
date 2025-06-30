import React from 'react';
import CoffeeIcon from '@mui/icons-material/Coffee';
import TimerIcon from '@mui/icons-material/Timer';
import './PomodoroLog.css';

const PomodoroLog = ({ completedSessions }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="pomodoro-log">
            <h2>Today's Sessions</h2>
            <div className="session-list">
                {completedSessions.map((session, index) => (
                    <div key={index} className={`session-card ${session.isBreak ? 'break-session' : ''}`}>
                        <div className="session-icon">
                            {session.isBreak ? <CoffeeIcon /> : <TimerIcon />}
                        </div>
                        <div className="session-info">
                            <div className="session-time">
                                <span className="time-label">Started</span>
                                <span className="time-value">{formatTime(session.startTime)}</span>
                            </div>
                            <div className="session-duration">
                                <span className="duration-label">Duration</span>
                                <span className="duration-value">{Math.round(session.duration / 60)} minutes</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PomodoroLog;