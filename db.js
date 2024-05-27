const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // This is for simplicity. For production, handle SSL configuration properly.
        }
    },
    logging: false // Disable logging; default: console.log
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the PostgreSQL database.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
