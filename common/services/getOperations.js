var generateUri = require('./generateUri'),
    vulgarize = require('./vulgarize'),

    /**
     * @param {String} verb
     * @param {String} uri
     *
     * @return {Object|null}
     */
    getOperation = function(verb, uri) {
        'use strict';

        var type = '';

        switch (verb) {
            case 'POST':
                // hack for LoopBack's mass-update POST route
                type = uri.match(/update/) ? 'ReplaceResourceOperation' : 'CreateResourceOperation';
                break;

            case 'PUT':
                type = 'ReplaceResourceOperation';
                break;

            case 'DELETE':
                type = 'DeleteResourceOperation';
                break;
        }

        if (0 === type.length) {
            return null;
        }

        return {
            '@type': type,
            method: verb
        };
    };

/**
 * Parses exposed routes and fetches available REST operations for a model, sorted by URI
 *
 * @param {String} name
 * @param {Object} routes
 *
 * @return {Object}
 */
module.exports = function(name, routes) {
    'use strict';

    var operations = {};

    routes.forEach(function (route) {
        var verb = ('del' === route.verb) ? 'DELETE' : route.verb.toUpperCase(),
            isOperationalVerb = (-1 !== ['POST', 'PUT', 'DELETE'].indexOf(verb)),
            isSubMethod = (-1 !== route.method.indexOf('prototype.__')),
            isTarget = (route.method.split('.')[0] === name) && !isSubMethod,
            segments = {},
            uri,
            toKeep = false,
            operation,

            isSubTarget = isSubMethod && (-1 !== [vulgarize(name), vulgarize(name, true)].indexOf(
                route.method.split('__').pop().toLowerCase()
            ));

        segments[route.path] = null;
        uri = generateUri(segments);

        // Ignore read-only stuff and other models' endpoints
        if (!isOperationalVerb || (!isTarget && !isSubTarget)) {
            return;
        }

        if (!operations.hasOwnProperty(uri)) {
            operations[uri] = [];
        }

        operation = getOperation(verb, uri);
        operation && operations[uri].push(operation);
    });

    return operations;
};
