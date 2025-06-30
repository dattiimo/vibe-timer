import React from 'react';
import './CircularProgress.css';
import { formatTime } from '../utils/timeUtils';

const CircularProgress = ({ percentage, timeLeft, sessionProgress, dayProgress }) => {
    const [size, setSize] = React.useState(
        Math.min(Math.min(window.innerWidth - 40, 420), Math.min(window.innerHeight - 200, 420))
    );

    React.useEffect(() => {
        const handleResize = () => {
            setSize(Math.min(Math.min(window.innerWidth - 40, 420), Math.min(window.innerHeight - 200, 420)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const outerRadius = size * 0.42;
    const strokeWidth = size * 0.06;
    const gap = size * 0.007;
    const innerRadius = outerRadius - strokeWidth - gap;
    const innerRingInnerEdge = innerRadius - (strokeWidth / 2);
    const centerCircleRadius = innerRingInnerEdge - gap;
    
    const svgSize = size;
    const center = svgSize / 2;
    
    const innerCircumference = innerRadius * 2 * Math.PI;
    const outerCircumference = outerRadius * 2 * Math.PI;
    
    // Timer progress for outer circle
    const outerProgress = 100 - percentage;
    const outerStrokeDashoffset = outerCircumference - (outerProgress / 100) * outerCircumference;
    
    // Session progress for inner circle
    const innerProgress = Math.min(sessionProgress, 100);
    const innerStrokeDashoffset = innerCircumference - (innerProgress / 100) * innerCircumference;
    
    // Calculate clip path height based on day progress
    const clipHeight = (dayProgress / 100) * (centerCircleRadius * 2);
    
    return (
        <div className="circular-progress">
            <svg height={svgSize} width={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <defs>
                    <clipPath id="dayProgressClip">
                        <rect 
                            x={center - centerCircleRadius}
                            y={center + centerCircleRadius - clipHeight}
                            width={centerCircleRadius * 2}
                            height={clipHeight}
                        />
                    </clipPath>
                </defs>
                
                {/* Center circle */}
                <circle
                    className="center-circle"
                    cx={center}
                    cy={center}
                    r={centerCircleRadius}
                    clipPath="url(#dayProgressClip)"
                />
                
                {/* Outer circle background (timer) */}
                <circle
                    className="progress-background"
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    strokeWidth={strokeWidth}
                />
                
                {/* Outer circle progress (timer) */}
                <circle
                    className="progress-ring"
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${outerCircumference} ${outerCircumference}`}
                    style={{ strokeDashoffset: outerStrokeDashoffset }}
                />
                
                {/* Inner circle background (session progress) */}
                <circle
                    className="outer-progress-background"
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    strokeWidth={strokeWidth}
                />
                
                {/* Inner circle progress (session progress) */}
                <circle
                    className="outer-progress-ring"
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${innerCircumference} ${innerCircumference}`}
                    style={{ strokeDashoffset: innerStrokeDashoffset }}
                />
            </svg>
            <div className="timer-display">
                {formatTime(timeLeft * 1000)}
            </div>
        </div>
    );
};

export default CircularProgress;