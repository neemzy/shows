var getConfig = require('./getConfig'),
    url = require('./hypermediaUrl'),

    /**
     * @param {Model}  model
     * @param {String} key
     * @param {String} value
     */
    appendValue = function(model, key, value) {
        'use strict';

        // Overcome visibility limitations set up by LoopBack
        model.__defineGetter__(key, function() {
            return value;
        });
    };

module.exports = {
    /**
     * @param {Show}     show
     * @param {Function} next
     */
    appendToShow: function(show, next) {
        'use strict';

        var self = url.vulgarize('Show'),
            selfSegments = {},
            children = url.vulgarize('Episode'),
            childrenSegments = {};

        // Order matters
        selfSegments[self] = show.id;
        childrenSegments[self] = show.id;
        childrenSegments[children] = null;

        show.episodes.count(function (err, count) {
            appendValue(show, '@context', getConfig('Show', 'context'));
            appendValue(show, '@id', url.generate(selfSegments));
            appendValue(show, children, url.generate(childrenSegments));
            appendValue(show, 'numberOfEpisodes', count);

            next();
        });
    },

    /**
     * @param {Episode}  episode
     * @param {Function} next
     */
    appendToEpisode: function(episode, next) {
        'use strict';

        var self = url.vulgarize('Episode'),
            selfSegments = {},
            parent = url.vulgarize('Show'),
            parentSegments = {};

        // Order matters
        selfSegments[parent] = episode.showId;
        parentSegments[parent] = episode.showId;
        selfSegments[self] = episode.id;

        appendValue(episode, '@context', getConfig('Episode', 'context'));
        appendValue(episode, '@id', url.generate(selfSegments));
        appendValue(episode, 'partOfSeries', url.generate(parentSegments));

        next();
    }
};
