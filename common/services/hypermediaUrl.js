module.exports = {
    /**
     * Makes a Model name URL-suitable
     *
     * @param {String} name
     *
     * @return {String}
     */
    vulgarize: function(name) {
        'use strict';

        name = name.toLowerCase();

        var config = require('../models/' + name + '.json');

        if ('plural' in config) {
            name = config.plural.toLowerCase();
        } else {
            name += 's';
        }

        return name;
    },

    /**
     * @param {String} owner
     * @param {Number} id
     * @param {String} owned
     *
     * @return {String}
     */
    generate: function(owner, id, owned) {
        'use strict';

        owned = owned || '';

        var base = require('../../server/config').restApiRoot,
            uri = this.vulgarize(owner);

        if (0 < id) {
            uri += '/' + id;
        }

        if (0 < owned.length) {
            uri = uri + '/' + this.vulgarize(owned);
        }

        return base.replace(/\/$/g, '') + '/' + uri;
    }
};
