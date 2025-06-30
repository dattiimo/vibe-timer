export const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 1) {
        // Show only minutes if more than 1 minute remains
        return `${minutes}`;
    } else {
        // Show seconds with colon prefix when less than 1 minute remains
        return `:${seconds.toString().padStart(2, '0')}`;
    }
};

const parseTimeString = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

export const calculateDayProgress = (startOfDay, endOfDay) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const dayStartMinutes = parseTimeString(startOfDay);
    const dayEndMinutes = parseTimeString(endOfDay);
    
    // If current time is before start of day, return 0%
    if (currentMinutes < dayStartMinutes) {
        return 0;
    }
    
    // If current time is after end of day, return 100%
    if (currentMinutes > dayEndMinutes) {
        return 100;
    }
    
    // Calculate percentage through the day
    const totalDayMinutes = dayEndMinutes - dayStartMinutes;
    const minutesElapsed = currentMinutes - dayStartMinutes;
    return (minutesElapsed / totalDayMinutes) * 100;
};