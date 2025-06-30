import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import CircularProgress from './components/CircularProgress';
import Controls from './components/Controls';
import SessionHistory from './components/SessionHistory';
import Settings from './components/Settings';
import CookieBanner from './components/CookieBanner';
import { initGA, trackEvent, trackPageView } from './utils/analytics';
import { 
    getTodaySessions, 
    addSession, 
    loadTimerDuration, 
    saveTimerDuration,
    loadBreakDuration,
    saveBreakDuration,
    loadDailyTarget,
    saveDailyTarget,
    getTotalSessionDurationForToday,
    saveTimerState,
    loadTimerState,
    loadStartOfDay,
    saveStartOfDay,
    loadEndOfDay,
    saveEndOfDay
} from './utils/sessionStorage';
import { calculateDayProgress } from './utils/timeUtils';

import './App.css';
import './styles/global.css';

const App = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [duration, setDuration] = useState(loadTimerDuration());
    const [breakDuration, setBreakDuration] = useState(loadBreakDuration());
    const [dailyTarget, setDailyTarget] = useState(loadDailyTarget());
    const [timeLeft, setTimeLeft] = useState(duration);
    const [startTime, setStartTime] = useState(null);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [totalSessionDuration, setTotalSessionDuration] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [showCookieBanner, setShowCookieBanner] = useState(false);
    const [startOfDay, setStartOfDay] = useState(loadStartOfDay());
    const [endOfDay, setEndOfDay] = useState(loadEndOfDay());
    const [dayProgress, setDayProgress] = useState(0);
    const [showFooterMessage, setShowFooterMessage] = useState(true);

    useEffect(() => {
        // Check cookie consent status on mount
        const consentStatus = localStorage.getItem('cookieConsent');
        if (!consentStatus) {
            setShowCookieBanner(true);
        } else if (consentStatus === 'all') {
            initGA();
            trackPageView();
        }

        // Load initial sessions
        const todaySessions = getTodaySessions();
        setCompletedSessions(todaySessions);
        setTotalSessionDuration(getTotalSessionDurationForToday());

        // Restore timer state if it exists
        const savedState = loadTimerState();
        if (savedState) {
            setIsRunning(savedState.isRunning);
            setIsPaused(savedState.isPaused);
            setTimeLeft(savedState.timeLeft);
            setStartTime(savedState.startTime);
            setDuration(savedState.duration);
        }

        // Check if footer message should be shown
        const showMessage = localStorage.getItem('showMessage');
        if (showMessage === 'false') {
            setShowFooterMessage(false);
        }
    }, []);

    // Save timer state when any relevant state changes
    useEffect(() => {
        if (startTime) {
            saveTimerState({
                isRunning,
                isPaused,
                startTime: startTime.toISOString(),
                duration,
                timeLeft,
                isBreak
            });
        }
    }, [isRunning, isPaused, startTime, duration, timeLeft, isBreak]);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                const now = new Date();
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                const remaining = Math.max(0, duration - elapsedSeconds);
                
                if (remaining === 0) {
                    handleTimerComplete();
                } else {
                    setTimeLeft(remaining);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, startTime, duration]);

    useEffect(() => {
        // Check if notifications are supported and get initial permission state
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            return;
        }
        
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };

    const showNotification = () => {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return;
        }
        
        if (notificationPermission !== 'granted') {
            console.log('Notification permission not granted:', notificationPermission);
            return;
        }

        try {
            new Notification(isBreak ? 'Break Completed' : 'Focus Session Completed', {
                body: isBreak ? 'Your break has finished' : 'Your focus session has finished',
                icon: 'logo.svg',
                requireInteraction: true  // This will prevent auto-closing
            });
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    };

    const handleStartStop = () => {
        if (!isRunning) {
            // Starting a new timer or resuming a paused timer
            requestNotificationPermission();
            const now = new Date();
            
            if (isPaused) {
                // If resuming from pause, adjust startTime to maintain the correct timeLeft
                const elapsedTime = duration - timeLeft;
                setStartTime(new Date(now.getTime() - (elapsedTime * 1000)));
            } else {
                // Starting a new timer
                setTimeLeft(duration);
                setStartTime(now);
            }
            
            setIsRunning(true);
            setIsPaused(false);
        } else {
            // Pausing the timer
            setIsRunning(false);
            setIsPaused(true);
            // Keep the current timeLeft value when pausing
        }
    };

    const handleReset = () => {
        if (isPaused) {
            const now = new Date();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const completedDuration = Math.min(duration, elapsedSeconds);
            
            if (completedDuration > 0) {
                const session = {
                    startTime,
                    duration: completedDuration,
                    isBreak
                };
                addSession(session);
                setCompletedSessions(prev => [session, ...prev]);
                if (!isBreak) {
                    setTotalSessionDuration(prev => prev + completedDuration);
                }
            }
        }
        
        // Keep the current break/focus state
        setTimeLeft(duration);
        setStartTime(null);
        setIsRunning(false);
        setIsPaused(false);
    };

    const handleTimerComplete = () => {
        if (startTime) {
            const now = new Date();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const completedDuration = Math.min(duration, elapsedSeconds);
            
            if (completedDuration > 0) {
                const session = {
                    startTime,
                    duration: completedDuration,
                    isBreak
                };
                addSession(session);
                setCompletedSessions(prev => [session, ...prev]);
                if (!isBreak) {
                    setTotalSessionDuration(prev => prev + completedDuration);
                }
                showNotification();
                // Track session completion
                const eventLabel = isBreak ? 'break' : 'focus';
                trackEvent('Session', 'complete', eventLabel);
            }

            // Reset timer state
            setStartTime(null);
            setIsRunning(false);
            
            // If this was a break timer, switch to focus mode
            if (isBreak) {
                setIsBreak(false);
                const focusDuration = loadTimerDuration();
                setDuration(focusDuration);
                setTimeLeft(focusDuration);
            } else {
                setTimeLeft(duration);
            }
        }
    };

    const handleModeToggle = () => {
        const newIsBreak = !isBreak;
        setIsBreak(newIsBreak);
        
        // Set the appropriate duration based on mode
        if (newIsBreak) {
            setDuration(breakDuration);
            setTimeLeft(breakDuration);
        } else {
            const focusDuration = loadTimerDuration();
            setDuration(focusDuration);
            setTimeLeft(focusDuration);
        }
    };

    const calculateSessionProgress = () => {
        const targetDurationInSeconds = dailyTarget * 60; // Convert target minutes to seconds
        // Only include current timer progress if it's running, not a break, and hasn't completed
        const currentProgress = (isRunning && !isBreak && timeLeft > 0) ? (duration - timeLeft) : 0;
        const totalProgress = totalSessionDuration + currentProgress;
        return (totalProgress / targetDurationInSeconds) * 100;
    };

    const handleDurationChange = (newDuration) => {
        setDuration(newDuration);
        saveTimerDuration(newDuration);
        if (!isRunning) {
            setTimeLeft(newDuration);
        }
    };

    const handleBreakDurationChange = (newDuration) => {
        setBreakDuration(newDuration);
        saveBreakDuration(newDuration);
    };

    const handleDailyTargetChange = (newTarget) => {
        setDailyTarget(newTarget);
        saveDailyTarget(newTarget);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all');
        setShowCookieBanner(false);
        initGA();
        trackPageView();
    };

    const handleRejectNonEssential = () => {
        localStorage.setItem('cookieConsent', 'essential');
        setShowCookieBanner(false);
    };

    const handleStartOfDayChange = (time) => {
        setStartOfDay(time);
        saveStartOfDay(time);
    };

    const handleEndOfDayChange = (time) => {
        setEndOfDay(time);
        saveEndOfDay(time);
    };

    // Calculate day progress every minute
    useEffect(() => {
        const calculateProgress = () => {
            const progress = calculateDayProgress(startOfDay, endOfDay);
            setDayProgress(progress);
        };

        // Calculate initial progress
        calculateProgress();

        // Update progress every minute
        const interval = setInterval(calculateProgress, 60000);
        return () => clearInterval(interval);
    }, [startOfDay, endOfDay]);

    return (
        <div className="app">
            {showSettings ? (
                <Settings
                    onClose={toggleSettings}
                    duration={isBreak ? breakDuration : duration}
                    onDurationChange={handleDurationChange}
                    breakDuration={breakDuration}
                    onBreakDurationChange={handleBreakDurationChange}
                    dailyTarget={dailyTarget}
                    onDailyTargetChange={handleDailyTargetChange}
                    startOfDay={startOfDay}
                    onStartOfDayChange={handleStartOfDayChange}
                    endOfDay={endOfDay}
                    onEndOfDayChange={handleEndOfDayChange}
                />
            ) : showHistory ? (
                <SessionHistory
                    onClose={toggleHistory}
                    completedSessions={completedSessions}
                />
            ) : (
                <>
                    <header className="app-header">
                        <div className="header-container">
                            <IconButton 
                                className="settings-button"
                                onClick={toggleSettings}
                                size="large"
                                color="inherit"
                            >
                                <SettingsIcon />
                            </IconButton>
                            <IconButton 
                                className="history-button"
                                onClick={toggleHistory}
                                size="large"
                                color="inherit"
                            >
                                <HistoryIcon />
                            </IconButton>
                        </div>
                    </header>
                    
                    <main className="app-content">
                        <CircularProgress 
                            percentage={(timeLeft / duration) * 100}
                            timeLeft={timeLeft}
                            sessionProgress={calculateSessionProgress()}
                            dayProgress={dayProgress}
                        />
                        <Controls 
                            isRunning={isRunning}
                            isPaused={isPaused}
                            isBreak={isBreak}
                            onStartStop={handleStartStop}
                            onReset={handleReset}
                            onModeToggle={handleModeToggle}
                        />
                    </main>

                    {showFooterMessage && (
                        <footer className="app-footer">
                            Created by AI with guidance from &nbsp;<a href="https://x.com/dattiimo" target="_blank" rel="noopener noreferrer">dattiimo</a>
                        </footer>
                    )}

                    {showCookieBanner && (
                        <CookieBanner 
                            onAcceptAll={handleAcceptAll}
                            onRejectNonEssential={handleRejectNonEssential}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default App;