/*/ StatusPage-API https://github.com/joshua-noakes1/StatusPage-API
    Made with ❤️  2020.
/*/
require('dotenv').config();
console.log('----------\nStatusPage-API https://github.com/joshua-noakes1/StatusPage-API')

// We set these arrays up here so we can use the major event system below see line [] for more
var plex_error = [];
var ombi_error = [];
var radarr_error = [];
var sonarr_error = [];
var xteve_error = [];

// Cachet
// Setting up the Cachet API
var CachetAPI = require('cachet-api');
var cachet = new CachetAPI({
    // Base URL of your installed Cachet status page
    url: process.env.cachet_url,
    // Cachet API key (provided within the admin dashboard)
    apiKey: process.env.cachet_api
});

// Express
// We're going to setup and start the Express server so we can process webhooks https://blog.bearer.sh/consuming-webhooks-with-node-js-and-express/
const express = require("express")
const bodyParser = require("body-parser");
const {
    delay
} = require('bluebird');
// Initialize express and define a port
const app = express()
const PORT = 3000
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Express server running on port ${PORT} 🚀 `));


// Setting "post" to be where webhooks can post to
app.post("/post", (req, res) => {
    res.status(200).end() // Very Important 
    // We now check if theres an error
    if (!req.body.webhook_event_data.check_state_name == 'Available' || req.body.webhook_event_data.check_state_name == 'Not Responding' || req.body.webhook_event_data.check_state_name == 'Reporting Error') {
        console.log('----------')
        // Checking for configured services, with their set names in freshping
        if (req.body.webhook_event_data.check_name == 'plex') {
            // Console log what service
            console.log('New Plex Issue');
            // For the major error array see line [] for more
            plex_error.push(1);
            // Call the Partial Outage function
            plex_generic_error();
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'ombi') {
            console.log('New Ombi Issue');
            ombi_error.push(1);
            ombi_generic_error();
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'radarr') {
            console.log('New Radarr Issue');
            radarr_error.push(1);
            radarr_generic_error();
        }
        if (req.body.webhook_event_data.check_name == 'sonarr') {
            console.log('New Sonarr Issue');
            sonarr_error.push(1);
            console.log(sonarr_error);
            sonarr_generic_error();
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'xteve') {
            console.log('New XTeVe Issue');
            xteve_error.push(1);
            xteve_generic_error();
        }
    } else {
        console.log('----------')
        // if we recover successfuly we follow down here
        if (req.body.webhook_event_data.check_name == 'plex2') {
            // We console log that the service has recovered 
            if (!plex_error[plex_error.length - 1] == 0) {
                console.log('Plex Recovered!');
                // We set Operational within cachet
                plex_fix();
                // We push 0 to the array so the major event doesnt get triggered 
                plex_error.push(0);
            }
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'ombi') {
            if (!ombi_error[ombi_error.length - 1] == 0) {
                console.log('Ombi Recovered!');
                ombi_fix();
                ombi_error.push(0);
            }
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'radarr') {
            if (!radarr_error[radarr_error.length - 1] == 0) {
                console.log('Radarr Recovered!');
                radarr_fix();
                radarr_error.push(0);
            }
        }
        if (req.body.webhook_event_data.check_name == 'sonarr') {
            if (!sonarr_error[sonarr_error.length - 1] == 0) {
                console.log('Sonarr Recovered!');
                sonarr_fix();
                sonarr_error.push(0);
            }
        }
        //TODO
        if (req.body.webhook_event_data.check_name == 'xteve') {
            if (!xteve_error[xteve_error.length - 1] == 0) {
                console.log('XTeVe Recovered!');
                xteve_fix();
                xteve_error.push(0);
            }
        }
    }
});


// Functions

// Plex
// Plex generic event aka Partial Outage in cachet is called when an issue if first found
function plex_generic_error() {
    // TODO: Look at adding ifttt webhook intergration 
    var incident = {
        // Incident name
        name: 'Plex connectivity issues',
        // Incident description (supports markdown)
        message: 'Plex is currently having connectivity issues on Firepower Cloud.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Investigating',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.plexid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Partial Outage'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Plex Partial Outage Reported at ' + response.data.created_at);
            (async () => {
                // We're now setting a delay for 10 mins here before triggering the major event function which sets The service into Major Outage mode
                await delay(600 * 1000)
                if (!plex_error[plex_error.length - 1] == 0) {
                    plex_major();
                }
            })();
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });

}

// major outage
function plex_major() {
    var incident = {
        // Incident name
        name: 'Major plex connectivity issues',
        // Incident description (supports markdown)
        message: 'Plex is currently having major connectivity issues on Firepower Cloud.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Investigating',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.plexid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Major Outage'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Plex Major Outage Reported at ' + response.data.created_at);
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });
}

function plex_fix() {
    var incident = {
        // Incident name
        name: 'Plex recovered',
        // Incident description (supports markdown)
        message: 'Plex has now recovered.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Fixed',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.plexid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Operational'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Plex Fix Reported at ' + response.data.created_at);
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });
}



// Ombi
function ombi_generic_error() {
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

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Ombi Partial Outage Reported at ' + response.data.created_at);
            (async () => {
                // We're now setting a delay for 10 mins here before triggering the major event function which sets The service into Major Outage mode
                await delay(600 * 1000)
                if (!plex_error[plex_error.length - 1] == 0) {
                    ombi_major();
                }
            })();
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });

}

// major outage
function ombi_major() {
    var incident = {
        // Incident name
        name: 'Major ombi connectivity issues',
        // Incident description (supports markdown)
        message: 'Ombi is currently having major connectivity issues on Firepower Cloud.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Investigating',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.ombiid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Major Outage'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Ombi Major Outage Reported at ' + response.data.created_at);
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });
}

function ombi_fix() {
    var incident = {
        // Incident name
        name: 'Ombi recovered',
        // Incident description (supports markdown)
        message: 'Ombi has now recovered.',
        // Incident status (https://docs.cachethq.io/docs/incident-statuses)
        status: 'Fixed',
        // Whether the incident will be visible to the public or only to logged in users
        visible: true,
        // Whether to send out e-mail notifications to subscribers regarding this incident
        notify: true,
        // Component ID affected by this incident (optional)
        component_id: process.env.ombiid,
        // Component status (required if component_id is specified) (https://docs.cachethq.io/docs/component-statuses)
        component_status: 'Operational'
    };

    // Report it so it shows up on the status page
    cachet.reportIncident(incident)
        .then(function (response) {
            // Log API response
            console.log('Ombi Fix Reported at ' + response.data.created_at);
        }).catch(function (err) {
            // Log errors to console
            console.log('Fatal Error', err);
        });
}