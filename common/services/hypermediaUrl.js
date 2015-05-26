var getConfig = require('./getConfig');

module.exports = {
    /**
     * Makes a Model name URL-suitable
     *
     * @param {String}  name
     * @param {Boolean} singular
     *
     * @return {String}
     */
    vulgarize: function(name, singular) {
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
    },

    /**
     * @param {Object} segments
     *
     * @return {String}
     */
    generate: function(segments) {
        'use strict';

        var root = require('../../server/config').restApiRoot,
            uri = '';

        for (var key in segments) {
            uri += '/' + key;
            segments[key] && (uri += '/' + segments[key]);
        }

        return root.replace(/\/$/g, '') + uri;
    }
};
