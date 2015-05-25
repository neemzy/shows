var hypermediaUrl = require('./hypermediaUrl'),

    /**
     * @param {Model}  model
     * @param {String} owner
     * @param {Number} id
     * @param {String} owned
     */
    appendUrl = function(model, owner, id, owned) {
        'use strict';

        owned = owned || '';

        var getter = (0 < owned.length) ? hypermediaUrl.vulgarize(owned) : owner.toLowerCase();

        // Overcome visibility limitations set up by LoopBack
        model.__defineGetter__(getter, function() {
            return hypermediaUrl.generate(owner, id, owned);
        });
    };

module.exports = {
    /**
     * @param {Show} show
     */
    appendEpisodesUrlToShow: function(show) {
        'use strict';

        appendUrl(show, 'Show', show.id, 'Episode');
    },

    /**
     * @param {Episode} episode
     */
    appendShowUrlToEpisode: function(episode) {
        'use strict';

        appendUrl(episode, 'Show', episode.showId);
        episode.showId = undefined;
    }
};
