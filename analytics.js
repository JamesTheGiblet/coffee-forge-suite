// analytics.js
// Track events locally and batch send
const AnalyticsTracker = {
    events: [],
    
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: Date.now(),
            url: window.location.pathname
        };
        
        this.events.push(event);
        
        // Console log for debugging
        console.log('📊 Event:', eventName, data);
        
        // Send to analytics service (add your service here)
        if (window.plausible) {
            plausible(eventName, { props: data });
        }
        
        // Store locally
        this.saveLocal();
    },
    
    saveLocal() {
        try {
            localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-100)));
        } catch (e) {
            // Ignore storage errors
        }
    },
    
    getEvents() {
        return this.events;
    }
};

// Track page views
window.addEventListener('load', () => {
    AnalyticsTracker.track('page_view', {
        page: window.location.pathname
    });
});

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        AnalyticsTracker.track('button_click', {
            text: e.target.textContent.substring(0, 50)
        });
    }
});

// Error tracking
window.addEventListener('error', (e) => {
    AnalyticsTracker.track('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno
    });
});