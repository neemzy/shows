var async = require('async'),
    appendGetter = require('./appendGetter'),
    generateUri = require('./generateUri')
    getConfig = require('./getConfig'),
    vulgarize = require('./vulgarize'),

    /**
     * @param {Show}     show
     * @param {Function} callback
     */
    processShow = function(show, callback) {
        'use strict';

        var self = vulgarize('Show'),
            selfSegments = {},
            children = vulgarize('Episode'),
            childrenSegments = {};

        // Build URI (order matters)
        selfSegments[self] = show.id;
        childrenSegments[self] = show.id;
        childrenSegments[children] = null;

        show.episodes.count(function (err, count) {
            appendGetter(show, '@context', getConfig('Show', 'context'));
            appendGetter(show, '@id', generateUri(selfSegments));
            appendGetter(show, children, generateUri(childrenSegments));
            appendGetter(show, 'numberOfEpisodes', count);

            callback();
        });
    },

    /**
     * @param {Episode}  episode
     * @param {Function} callback
     */
    processEpisode = function(episode, callback) {
        'use strict';

        var self = vulgarize('Episode'),
            selfSegments = {},
            parent = vulgarize('Show'),
            parentSegments = {};

        // Order matters
        selfSegments[parent] = episode.showId;
        parentSegments[parent] = episode.showId;
        selfSegments[self] = episode.id;

        appendGetter(episode, '@context', getConfig('Episode', 'context'));
        appendGetter(episode, '@id', generateUri(selfSegments));
        appendGetter(episode, 'partOfSeries', generateUri(parentSegments));

        callback();
    };

/**
 * Process API results to make them hypermedia-friendly
 *
 * @param {Array}    results
 * @param {Object}   models
 * @param {Function} callback
 */
module.exports = function(results, models, callback) {
    'use strict';

    if (0 == results.length) {
        callback();

        return;
    }

    var type = '', /** @var {String} */
        operation; /** @var {Function} */

    // Determine type from first result
    for (var key in models) {
        if (results[0] instanceof models[key]) {
            type = key;

            break;
        }
    }

    // TODO: abstract this out
    switch (type) {
        case 'Show':
            operation = processShow;
            break;

        case 'Episode':
            operation = processEpisode;
            break;
    }

    if ('undefined' === typeof operation) {
        callback();

        return;
    }

    async.each(results, operation, callback);
};
