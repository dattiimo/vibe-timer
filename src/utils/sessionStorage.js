const STORAGE_KEY = 'pomodoroSessions';
const TIMER_DURATION_KEY = 'pomodoroTimerDuration';
const BREAK_DURATION_KEY = 'pomodoroBreakDuration';
const DAILY_TARGET_KEY = 'pomodoroDailyTarget';
const TIMER_STATE_KEY = 'pomodoroTimerState';
const START_OF_DAY_KEY = 'pomodoroStartOfDay';
const END_OF_DAY_KEY = 'pomodoroEndOfDay';
const DEFAULT_DURATION = 25 * 60; // 25 minutes in seconds
const DEFAULT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds
const DEFAULT_DAILY_TARGET = 300; // Default to 300 minutes per day
const DEFAULT_START_OF_DAY = '09:00';
const DEFAULT_END_OF_DAY = '17:00';

export const loadSessions = () => {
    try {
        const storedSessions = localStorage.getItem(STORAGE_KEY);
        if (!storedSessions) return {};

        const sessions = JSON.parse(storedSessions);
        
        // Convert stored date strings back to Date objects
        Object.keys(sessions).forEach(date => {
            sessions[date] = sessions[date].map(session => ({
                ...session,
                startTime: new Date(session.startTime)
            }));
        });

        return sessions;
    } catch (error) {
        console.error('Error loading sessions:', error);
        return {};
    }
};

export const saveSessions = (sessions) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Error saving sessions:', error);
    }
};

export const getTodaySessions = () => {
    const allSessions = loadSessions();
    const today = new Date().toISOString().split('T')[0];
    return allSessions[today] || [];
};

export const addSession = (session) => {
    const allSessions = loadSessions();
    const today = new Date().toISOString().split('T')[0];
    
    if (!allSessions[today]) {
        allSessions[today] = [];
    }
    
    allSessions[today] = [session, ...allSessions[today]];
    saveSessions(allSessions);
};

export const saveTimerDuration = (duration) => {
    try {
        localStorage.setItem(TIMER_DURATION_KEY, duration.toString());
    } catch (error) {
        console.error('Error saving timer duration:', error);
    }
};

export const loadTimerDuration = () => {
    try {
        const storedDuration = localStorage.getItem(TIMER_DURATION_KEY);
        return storedDuration ? parseInt(storedDuration, 10) : DEFAULT_DURATION;
    } catch (error) {
        console.error('Error loading timer duration:', error);
        return DEFAULT_DURATION;
    }
};

export const saveBreakDuration = (duration) => {
    try {
        localStorage.setItem(BREAK_DURATION_KEY, duration.toString());
    } catch (error) {
        console.error('Error saving break duration:', error);
    }
};

export const loadBreakDuration = () => {
    try {
        const storedDuration = localStorage.getItem(BREAK_DURATION_KEY);
        return storedDuration ? parseInt(storedDuration, 10) : DEFAULT_BREAK_DURATION;
    } catch (error) {
        console.error('Error loading break duration:', error);
        return DEFAULT_BREAK_DURATION;
    }
};

export const saveDailyTarget = (target) => {
    try {
        localStorage.setItem(DAILY_TARGET_KEY, target.toString());
    } catch (error) {
        console.error('Error saving daily target:', error);
    }
};

export const loadDailyTarget = () => {
    try {
        const storedTarget = localStorage.getItem(DAILY_TARGET_KEY);
        return storedTarget ? parseInt(storedTarget, 10) : DEFAULT_DAILY_TARGET;
    } catch (error) {
        console.error('Error loading daily target:', error);
        return DEFAULT_DAILY_TARGET;
    }
};

export const saveTimerState = (state) => {
    try {
        if (state.startTime) {
            localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
                startTime: state.startTime,
                duration: state.duration,
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
                isPaused: state.isPaused,
                isBreak: state.isBreak
            }));
        } else {
            localStorage.removeItem(TIMER_STATE_KEY);
        }
    } catch (error) {
        console.error('Error saving timer state:', error);
    }
};

export const loadTimerState = () => {
    try {
        const storedState = localStorage.getItem(TIMER_STATE_KEY);
        if (!storedState) return null;

        const state = JSON.parse(storedState);
        const startTime = new Date(state.startTime);
        
        // If timer is paused, use the stored timeLeft
        if (state.isPaused) {
            return {
                isRunning: false,
                isPaused: true,
                timeLeft: state.timeLeft,
                startTime,
                duration: state.duration,
                isBreak: state.isBreak
            };
        }

        // If timer is running, calculate remaining time
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const timeLeft = Math.max(0, state.duration - elapsedSeconds);
        
        // Clear stored state if timer has expired
        if (timeLeft === 0) {
            localStorage.removeItem(TIMER_STATE_KEY);
            return null;
        }

        return {
            isRunning: state.isRunning,
            isPaused: false,
            timeLeft,
            startTime,
            duration: state.duration,
            isBreak: state.isBreak
        };
    } catch (error) {
        console.error('Error loading timer state:', error);
        return null;
    }
};

export const getTotalSessionDurationForToday = () => {
    const todaySessions = getTodaySessions();
    return todaySessions.reduce((total, session) => {
        // Only count non-break sessions toward the daily total
        return total + (session.isBreak ? 0 : session.duration);
    }, 0);
};

export const saveStartOfDay = (time) => {
    try {
        localStorage.setItem(START_OF_DAY_KEY, time);
    } catch (error) {
        console.error('Error saving start of day:', error);
    }
};

export const loadStartOfDay = () => {
    try {
        const storedTime = localStorage.getItem(START_OF_DAY_KEY);
        return storedTime || DEFAULT_START_OF_DAY;
    } catch (error) {
        console.error('Error loading start of day:', error);
        return DEFAULT_START_OF_DAY;
    }
};

export const saveEndOfDay = (time) => {
    try {
        localStorage.setItem(END_OF_DAY_KEY, time);
    } catch (error) {
        console.error('Error saving end of day:', error);
    }
};

export const loadEndOfDay = () => {
    try {
        const storedTime = localStorage.getItem(END_OF_DAY_KEY);
        return storedTime || DEFAULT_END_OF_DAY;
    } catch (error) {
        console.error('Error loading end of day:', error);
        return DEFAULT_END_OF_DAY;
    }
};