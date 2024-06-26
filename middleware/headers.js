module.exports = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origins in production
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};
