// We Import cachet and dotenv
require('dotenv').config();
var CachetAPI = require('cachet-api');
var cachet = new CachetAPI({
    // Base URL of your installed Cachet status page
    url: process.env.cachet_url,
    // Cachet API key (provided within the admin dashboard)
    apiKey: process.env.cachet_api
});

function major() {
    var incident = {
        // Incident name
        name: 'Major radarr connectivity issues',
        // Incident description (supports markdown)
        message: 'Radarr is currently having major connectivity issues on Firepower Cloud.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Investigating',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.radarrid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Major Outage'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Radarr Major Outage Reported at ' + response.data.created_at);
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });
}

module.exports = {
    major
}