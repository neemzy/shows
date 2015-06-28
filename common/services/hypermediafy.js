var async = require('async'),
    appendGetter = require('./appendGetter'),
    generateUri = require('./generateUri')
    getConfig = require('./getConfig'),
    getOperations = require('./getOperations'),
    toRegex = require('./toRegex'),
    vulgarize = require('./vulgarize');

/**
 * Process API results to make them hypermedia-friendly
 *
 * @param {Array}    results
 * @param {Object}   app
 * @param {Function} callback
 */
module.exports = function(results, app, callback) {
    'use strict';

    if (0 == results.length) {
        callback();
        return;
    }

    var type = null;

    // Determine type from first result
    for (var key in app.models) {
        if (results[0] instanceof app.models[key]) {
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
        children = [],
        operations = getOperations(type, app.remotes().handler('rest').adapter.allRoutes());

    // Determine parent and children models from relations
    for (var key in relations) {
        switch (relations[key].type) {
            case 'belongsTo':
                parent = vulgarize(key);
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
            var selfSegments = {},
                selfUri;

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
            selfUri = generateUri(selfSegments);
            appendGetter(result, '@id', selfUri);

            // Append operations, if any
            for (var uri in operations) {
                if (selfUri.match(toRegex(uri))) {
                    appendGetter(result, 'operations', operations[uri]);
                    break;
                }
            }

            callback();
        },
        callback
    );
};
