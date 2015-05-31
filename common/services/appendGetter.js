/**
 * Force-appends a value to a LoopBack model,
 * thus overcoming its visibility limitations
 *
 * @param {Model}  model
 * @param {String} key
 * @param {String} value
 */
module.exports = function(model, key, value) {
    'use strict';

    model.__defineGetter__(key, function() {
        return value;
    });
};
