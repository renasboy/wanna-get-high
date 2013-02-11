// HIGH MODEL
var High = function (options) {
    var exports = {};
    
    //name
    exports.name        = options.name;
    // time it takes to make effect
    exports.delay       = options.delay;
    // how high it gets
    exports.speed       = options.speed;
    // how long it stays high, before comedown
    exports.duration    = options.duration;
    // tolerance
    exports.tolerance   = options.tolerance;
    // effects
    exports.effects     = options.effects;
    // icon position in the sprite
    exports.icon        = options.icon;

    return exports;
};
