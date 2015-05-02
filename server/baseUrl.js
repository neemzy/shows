var config = require('./config');

module.exports = function(req) {
    return req.protocol + '://' + req.get('host') + config.restApiRoot;
};
