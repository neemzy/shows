/**
 * @param {Object} segments
 *
 * @return {String}
 */
module.exports = function(segments) {
    'use strict';

    var root = require('../../server/config').restApiRoot,
        uri = '';

    for (var key in segments) {
        uri += '/' + key;
        segments[key] && (uri += '/' + segments[key]);
    }

    return (root + uri).replace(/\/{2,}/g, '/').toLowerCase();
};
