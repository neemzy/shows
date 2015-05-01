module.exports = function(Episode) {
    'use strict';

    // Season number cannot be 0
    Episode.validate('season', function (err) {
        if (1 > this.season) {
            err();
        }
    });

    // Episode number cannot be 0
    Episode.validate('number', function (err) {
        if (1 > this.number) {
            err();
        }
    });

    // Episode must be linked to a valid Show
    Episode.validateAsync('showId', function (err, done) {
        this.show(function (error, show) {
            if (error || null === show) {
                err();
            }

            done();
        });
    });
};
