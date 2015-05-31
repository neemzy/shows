var hypermediafy = require('../../common/services/hypermediafy'),
    toArray = require('../../common/services/toArray');

module.exports = function(app) {
    'use strict';

    app.remotes().after('**', function (ctx, next) {
        hypermediafy(toArray(ctx.result), app.models, next);
    });
};
