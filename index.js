// We're going to import all libs we require here dotenv, fs, express, body parser and any services from freshping
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const services = require('./Services');

// We're going to setup our express server to accept post requets under :3000/post
const app = express();
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());
// Start express on port 3000
app.listen(3000, () => console.log('🚀 Started Express Server 🚀'));
// setting up our post on /post
app.post("/post", (req, res) => {
    // We need to reply 200 OK else some services might keep sending the hook till they get a response
    res.status(200).end()
    // We look if an error occured
    if (req.body.webhook_event_data.check_state_name == 'Not Responding' || req.body.webhook_event_data.check_state_name == 'Reporting Error') {
        console.log('----------')
        // We check what service errored and then act upon it 
        switch (req.body.webhook_event_data.check_name) {
            case 'plex':
                // we check if an error event is currently in action
                if (services.ed.data.plex == 0) {
                // Console log the error and what service caused it
                console.log(`New Plex Error!`);
                // We push 1 to the json object so we can track the error
                services.ed.data.plex = 1;
                // Then we call the main fuction from the services partial error js
                services.plex_partial.main();
                }
                break;
        }
    } else if (req.body.webhook_event_data.check_state_name == 'Available') {
        console.log('----------')
        // We check if we've recovered 
        switch (req.body.webhook_event_data.check_name) {
            case 'plex':
                // we check if an error event is currently in action
                if (!services.ed.data.plex == 0) {
                // Console log the error and what service caused it
                console.log(`New Plex Fix!`);
                // We push 1 to the json object so we can track the error
                services.ed.data.plex = 0;
                // Then we call the main fuction from the services partial error js
                services.plex_fix.fix();
                }
                break;
        }

    } else {
        // We should hopefuly never get here but if we do we just console log that we have
        console.log('You should never see this...');
    }
});