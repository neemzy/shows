var pluralizer = require('./pluralizer');

module.exports = {
    /**
     * @param {String} baseUrl
     * @param {String} owner
     * @param {String} owned
     * @param {Number} id
     *
     * @return {String}
     */
    generate: function(base, owner, owned, id) {
        'use strict';

        var uri = pluralizer(owner, true) + '/' + id + '/' + pluralizer(owned, true);

        return base.replace(/\/$/g, '') + '/' + uri.replace(/^\//g, '');
    },

    /**
     * @param {Model}  model
     * @param {String} baseUrl
     * @param {String} owner
     * @param {String} owned
     */
    append: function(model, baseUrl, owner, owned) {
        'use strict';

        // Overcome visibility limitations set up by LoopBack
        model.__defineGetter__(pluralizer(owned, true), function() {
            return this.generate(baseUrl, owner, owned, model.id);
        }.bind(this));
    }
};
