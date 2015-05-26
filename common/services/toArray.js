/**
 * @param {*} value
 *
 * @return {Array}
 */
module.exports = function(value) {
    'use strict';

    if (!value) {
        return [];
    }

    if (!Array.isArray(value)) {
        return [value];
    }

    return value;
};
