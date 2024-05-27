require('dotenv').config();

const express = require('express');
const app = express();
const user = require('./controllers/usercontroller');
const item = require('./controllers/itemcontroller');
const booking = require('./controllers/bookingcontroller');
const sequelize = require('./db');
const bodyParser = require('body-parser');
const headers = require('./middleware/headers');
const validateSession = require('./middleware/validate-session');

// Database synchronization
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));

// Middleware
app.use(bodyParser.json());
app.use(headers);

// Routes
app.use('/api', user);
app.use('/items', item);
app.use('/bookings', booking);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
});
