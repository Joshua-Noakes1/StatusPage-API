// We Import cachet, delay and dotenv
require('dotenv').config();
var CachetAPI = require('cachet-api');
var cachet = new CachetAPI({
    // Base URL of your installed Cachet status page
    url: process.env.cachet_url,
    // Cachet API key (provided within the admin dashboard)
    apiKey: process.env.cachet_api
});
const {
    delay
} = require('bluebird');
// We're importing the json errors and the major event
const major_event = require('./major')
const error_data = require('../arrays/array');

// Our main Partial outage Function
function main() {
    var incident = {
        // Incident name
        name: 'Ombi connectivity issues',
        // Incident description (supports markdown)
        message: 'Ombi is currently having connectivity issues on Firepower Cloud.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Investigating',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.ombiid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Partial Outage'
    };

    //   Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Ombi Partial Outage Reported at ' + response.data.created_at);
            (async () => {

                // We're now setting a delay for 10 mins here before triggering the major event function which sets The service into Major Outage mode
                await delay(600 * 1000)
                if (!error_data.data.ombi == 0) {
                    major_event.major();
                }
            })();
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });


}

// exporting main
module.exports = {
    main
}