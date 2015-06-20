var async = require('async'),
    appendGetter = require('./appendGetter'),
    generateUri = require('./generateUri')
    getConfig = require('./getConfig'),
    vulgarize = require('./vulgarize');

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

    var type = null;

    // Determine type from first result
    for (var key in models) {
        if (results[0] instanceof models[key]) {
            type = key;
            break;
        }
    }

    if (null === type) {
        callback();
        return;
    }

    var config = getConfig(type, 'hypermedia'),
        relations = getConfig(type, 'relations'),
        self = vulgarize(type),
        parent = null,
        parentKey = null,
        children = [];

    // Determine parent and children models from relations
    for (var key in relations) {
        switch (relations[key].type) {
            case 'belongsTo':
                parent = key;
                parentKey = relations[key].foreignKey || key + 'Id';
                break;

            case 'hasMany':
                children.push(key);
                break;
        }
    }

    async.each(
        results,
        function (result, callback) {
            var selfSegments = {};

            // Append everything from model hypermedia configuration
            for (var key in config) {
                appendGetter(result, key, config[key]);
            }

            // Append parent URI, if any (and alter self URI)
            if (null != parent) {
                var segments = {};
                segments[parent] = result[parentKey];
                selfSegments[parent] = result[parentKey];

                appendGetter(
                    result,
                    parent,
                    generateUri(segments)
                );

                result[parentKey] = undefined;
            }

            // Append children URIs, if any
            children.forEach(function (child) {
                var segments = {};
                segments[self] = result.id;
                segments[child] = null;

                appendGetter(
                    result,
                    child,
                    generateUri(segments)
                );
            });

            selfSegments[self] = result.id;
            appendGetter(result, '@id', generateUri(selfSegments));

            callback();
        },
        callback
    );
};
