import ReactGA from 'react-ga4';

// Replace with your actual GA4 measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXX';

export const initGA = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const trackEvent = (category, action, label) => {
    ReactGA.event({
        category,
        action,
        label
    });
};

export const isAnalyticsEnabled = () => {
    return localStorage.getItem('cookieConsent') === 'all';
};