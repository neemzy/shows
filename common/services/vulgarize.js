var getConfig = require('./getConfig');

/**
 * Makes a Model name URL-suitable
 *
 * @param {String}  name
 * @param {Boolean} singular
 *
 * @return {String}
 */
module.exports = function(name, singular) {
    'use strict';

    var result = name.toLowerCase();

    if (!singular) {
        var plural = getConfig(name, 'plural')

        if ('undefined' !== typeof plural) {
            result = plural.toLowerCase();
        } else {
            result += 's';
        }
    }

    return result;
};
