import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CoffeeIcon from '@mui/icons-material/Coffee';
import TimerIcon from '@mui/icons-material/Timer';
import './Controls.css';

const Controls = ({ isRunning, isPaused, isBreak, onStartStop, onReset, onModeToggle }) => {
    return (
        <div className="controls">
            {(!isRunning || isPaused) && (
                <IconButton 
                    onClick={onStartStop} 
                    className="control-button start-button"
                    size="large"
                >
                    <PlayArrowIcon />
                </IconButton>
            )}
            {isRunning && !isPaused && (
                <IconButton 
                    onClick={onStartStop} 
                    className="control-button pause-button"
                    size="large"
                >
                    <PauseIcon />
                </IconButton>
            )}
            {isPaused && (
                <IconButton 
                    onClick={onReset} 
                    className="control-button reset-button"
                    size="large"
                >
                    <RestartAltIcon />
                </IconButton>
            )}
            {!isRunning && !isPaused && (
                <>
                    {isBreak ? (
                        <IconButton 
                            onClick={onModeToggle} 
                            className="control-button focus-button"
                            size="large"
                        >
                            <TimerIcon />
                        </IconButton>
                    ) : (
                        <IconButton 
                            onClick={onModeToggle} 
                            className="control-button break-button"
                            size="large"
                        >
                            <CoffeeIcon />
                        </IconButton>
                    )}
                </>
            )}
        </div>
    );
};

export default Controls;