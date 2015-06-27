var generateUri = require('./generateUri'),

    /**
     * Builds a REST operation's representation based on a HTTP verb
     *
     * @param {String} verb
     *
     * @return {Object|null}
     */
    getOperationByVerb = function(verb) {
        'use strict';

        var type = '';

        switch (verb) {
            //FIXME: doesn't work for /model/update (need to know the URI?)
            case 'POST':
                type = 'CreateResourceOperation';
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
            segments = {},
            path,
            operation;

        segments[route.path] = null;
        path = generateUri(segments);

        // Ignore read-only stuff and other models' endpoints
        //FIXME: doesn't work for submodels
        if ((-1 === ['POST', 'PUT', 'DELETE'].indexOf(verb))
            || (route.method.split('.')[0] !== name)
            || (-1 !== route.method.indexOf('prototype.__'))
        ) {
            return;
        }

        if (!operations.hasOwnProperty(path)) {
            operations[path] = [];
        }

        operation = getOperationByVerb(verb);
        operation && operations[path].push(operation);
    });

    return operations;
};
