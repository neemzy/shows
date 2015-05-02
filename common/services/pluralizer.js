/**
 * @param {String}  model
 * @param {Boolean} toLowerCase
 *
 * @return {String}
 */
module.exports = function(model, toLowerCase) {
    var config = require('../models/' + model.toLowerCase() + '.json'),
        plural = model + 's';

    if (plural in config) {
        plural = config.plural;
    }

    return toLowerCase ? plural.toLowerCase() : plural;
};
