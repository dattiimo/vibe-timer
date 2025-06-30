import React from 'react';
import './CookieBanner.css';

const CookieBanner = ({ onAcceptAll, onRejectNonEssential }) => {
    return (
        <div className="cookie-banner">
            <div className="cookie-content">
                <p>
                    This app uses cookies and local storage to store your preferences and timer data. 
                    We also use analytics cookies to understand how you use our website.
                </p>
                <div className="cookie-buttons">
                    <button onClick={onRejectNonEssential} className="reject-button">
                        Reject Non-Essential
                    </button>
                    <button onClick={onAcceptAll} className="accept-button">
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;