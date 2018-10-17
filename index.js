require('dotenv').config();

var express = require('express');
var app = express();
const port = process.env.PORT || 5000;
var user = require('./controllers/usercontroller');
var item = require('./controllers/itemcontroller');
var booking = require('./controllers/bookingcontroller');
// var location = require('./controllers/locationcontroller');  // LATER
// var owner = require('./controllers/ownercontroller');        // LATER

var sequelize = require('./db');
var bodyParser = require('body-parser');

sequelize.sync();

app.use(bodyParser.json());

app.use(require('./middleware/headers'));
app.use(require('./middleware/validate-session'));

app.use('/api', user);
app.use('/items', item);
app.use('/bookings', booking);
// app.use('/locations', location);     // LATER
// app.use('/owners', owner);           // LATER

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
})

app.listen(port, function(){
    console.log(`App is listening on ${port}.`)
});