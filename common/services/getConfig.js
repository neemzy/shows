/**
 * @param {String} name
 * @param {String} key
 *
 * @return {String|undefined}
 */
module.exports = function(name, key) {
    'use strict';

    var config = require('../models/' + name.toLowerCase() + '.json');

    if (key in config) {
        return config[key];
    }

    return undefined;
};
