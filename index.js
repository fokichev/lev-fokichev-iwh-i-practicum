require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_KEY;
const config = {
    objectType: 'p_ghibli_movies',
    headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const route = `https://api.hubapi.com/crm/v3/objects/${config.objectType}?properties=name,director,year`;
    try {
        const response = await axios.get(route, { headers: config.headers });

        // console.log(response.data.results);
        res.render('homepage', { title: 'List Custom Objects Table | Integrating With HubSpot I Practicum.', data: response.data.results });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { name, director, year } = req.body;
    const payload = { properties: { name, director, year } };
    const route = `https://api.hubapi.com/crm/v3/objects/${config.objectType}`;

    try {
        const response = await axios.post(route, payload, { headers: config.headers });

        // console.log(response.data);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));