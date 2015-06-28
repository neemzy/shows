/**
 * Converts an URI mask to a regular expression
 *
 * @param {String} mask
 *
 * @return {RegExp}
 */
module.exports = function(mask) {
    return new RegExp('^' + mask.replace(/:[a-z]+/g, '\\d+') + '$');
}