// Server file of API

const express           = require('express');
const admin             = require('firebase-admin');
let serviceAccount      = require('./config/tocca-t-a-7ea4a4be4710')
const bodyParser        = require('body-parser');
let path                = require('path');

const app               = express();

const port              = 4900;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Set public path to protect againist attempted direct url access in browser
app.set('public', path.join(__dirname, 'public'));
app.use(express.static(app.get('public')));

require('./api/routes')(app, db);

app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});