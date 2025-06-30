import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PomodoroLog from './PomodoroLog';
import './SessionHistory.css';

const SessionHistory = ({ onClose, completedSessions }) => {
    return (
        <div className="session-history">
            <div className="session-history-header">
                <h2>Session History</h2>
                <IconButton 
                    onClick={onClose}
                    size="large"
                    color="inherit"
                    className="close-button"
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="session-history-content">
                <PomodoroLog completedSessions={completedSessions} />
            </div>
        </div>
    );
};

export default SessionHistory;