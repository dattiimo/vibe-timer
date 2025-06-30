import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Settings.css';

const Settings = ({ 
    onClose, 
    duration, 
    onDurationChange, 
    breakDuration, 
    onBreakDurationChange, 
    dailyTarget, 
    onDailyTargetChange,
    startOfDay,
    onStartOfDayChange,
    endOfDay,
    onEndOfDayChange
}) => {
    const handleDurationChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        onDurationChange(value * 60);
    };

    const handleBreakDurationChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        onBreakDurationChange(value * 60);
    };

    const handleDailyTargetChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        onDailyTargetChange(value);
    };

    return (
        <div className="settings-screen">
            <div className="settings-header">
                <h2>Settings</h2>
                <IconButton 
                    className="close-button"
                    onClick={onClose}
                    size="large"
                    color="inherit"
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="settings-content">
                <div className="setting-item">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                        id="duration"
                        type="number"
                        min="1"
                        value={Math.floor(duration / 60)}
                        onChange={handleDurationChange}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="breakDuration">Break Duration (minutes)</label>
                    <input
                        id="breakDuration"
                        type="number"
                        min="1"
                        value={Math.floor(breakDuration / 60)}
                        onChange={handleBreakDurationChange}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="dailyTarget">Daily Target (minutes)</label>
                    <input
                        id="dailyTarget"
                        type="number"
                        min="1"
                        value={dailyTarget}
                        onChange={handleDailyTargetChange}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="startOfDay">Start of Day</label>
                    <input
                        id="startOfDay"
                        type="time"
                        value={startOfDay}
                        onChange={(e) => onStartOfDayChange(e.target.value)}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="endOfDay">End of Day</label>
                    <input
                        id="endOfDay"
                        type="time"
                        value={endOfDay}
                        onChange={(e) => onEndOfDayChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;