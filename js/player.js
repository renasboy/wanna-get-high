// PLAYER MODEL
var Player = function (options) {
    // get options
    var canvas  = options.canvas;
    var context = options.context;

    var exports = {};

    var image = new Image();
    image.src = 'images/player_sprite.png'

    // size of the player in the sprite
    var originalWidth  = 44;
    var originalHeight = 60;

    // desired size of player in the screen
    var sizeWidth      = 44;
    var sizeHeight     = 60;

    // number of initial lives
    var lives           = 3;

    // initial position
    var y               = 0;
    var x               = 0;

    var isHigh          = false;
    var speed           = 0;
    var toleranceShort  = {};
    var toleranceLong   = {};
    var highOn          = {};
    var pocket          = {}
    var effects         = {};
    
    // turns to true if pocket is empty
    exports.isLooser    = false;

    exports.init = function (options) {
        // initial position
        y               = canvas.height - sizeHeight;
        x               = (canvas.width * 0.5) - (sizeWidth * 0.5);

        isHigh          = false;
        speed           = 0;
        toleranceShort  = {};
        toleranceLong   = {};
        highOn          = {};
        pocket          = options.pocket
        effects         = {
            blur: 0,
            invert: 0,
            brightness: 0
        };
        
        // turns to true if pocket is empty
        exports.isLooser    = false;
    };

    exports.useLive = function () {
        lives--;
    }
    exports.getLives = function () {
        return lives;
    }
    exports.getSpeed = function () {
        return speed;
    }
    exports.getHeight = function () {
        return y;
    }

    exports.draw = function () {
        var position = 0;
        if (y < 100) {
            position = 4;
        }
        else if (y < 300) {
            position = 3;
        }
        else if (y < 550) {
            position = 2;
        }
        else if (y < canvas.height - sizeHeight) {
            position = 1;
        }
        context.drawImage(image, position * originalWidth, 0, originalWidth, originalHeight, x, y, sizeWidth, sizeHeight);
    }
    function comeDown (high) {
        highOn[high.name]--;
        toleranceShort[high.name] -= high.tolerance;
        // after all come downs check if still high
        isHigh         = stillHigh();
        // update effect
        removeEffects(high);
    }
    function stillHigh () {
        for (i in highOn) {
            if (highOn[i] > 0) {
                return true;
            }
        }
        return false;
    }
    function getTolerance (high) {
        if (!toleranceLong[high.name]) {
            toleranceLong[high.name] = 0;
        }
        if (!toleranceShort[high.name]) {
            toleranceShort[high.name] = 0;
        }
        var tolerance               = (toleranceLong[high.name] * 0.001) + (toleranceShort[high.name] * 0.1) + 1; 
        toleranceShort[high.name]  += high.tolerance;
        toleranceLong[high.name]   += high.tolerance;
        return tolerance;
    }
    function addEffects (high) {
        if (high.effects.blur) {
            effects.blur += high.effects.blur;
        }

        if (high.effects.invert) {
            effects.invert = high.effects.invert;
        }

        if (high.effects.brightness) {
            effects.brightness += high.effects.brightness;
        }
    }
    function removeEffects (high) {
        if (high.effects.blur) {
            effects.blur -= high.effects.blur;
        }

        if (high.effects.invert) {
            effects.invert = 0;
        }

        if (high.effects.brightness) {
            effects.brightness -= high.effects.brightness;
        }
    }
    exports.getEffects = function () {
        return effects;
    }
    /*
    exports.getEffects = function () {
        if (!isHigh) {
            return 'none';
        }
        return 'blur(' + effects.blur + 'px) invert(' + effects.invert + ')';
        return 'blur(' + effects.blur + 'px) invert(' + effects.invert + ') brightness(' + effects.brightness + '%)';
    }
    */
    exports.getHigh = function (high) {
        setTimeout(function () {
            getFromPocket(high);
            isHigh     = true;
            if (!highOn[high.name]) {
                highOn[high.name] = 0;
            }
            highOn[high.name]++;
            // update effect
            addEffects(high);
            var tolerance   = getTolerance(high);
            duration    = high.duration / tolerance;
            speed       += parseInt(high.speed / tolerance);
            // TODO apply overdose
            if (speed > 200) {
                overdose = true;
            }
            setTimeout(function () { comeDown(high); }, duration);
        }, high.delay);
    }
    exports.hasInPocket = function (high) {
        if (!pocket[high.name]) {
            return 0;
        }
        return pocket[high.name];
    }
    function addToPocket (high) {
        if (!pocket[high.name]) {
            pocket[high.name] = 0;
        }
        pocket[high.name]++;
    }
    function getFromPocket (high) {
        if (pocket[high.name]) {
            pocket[high.name]--;
            return true;
        }
        return false;
    }
    function isEmptyPocket () {
        for (i in pocket) {
            if (pocket[i] > 0) {
                return false;
            }
        }
        return true;
    }
    // changes to true once y < 0
    exports.reachedTop = function () {
        if (y < 0) {
            return true;
        }
        return false;
    };
    exports.update = function () {
        // getting high
        if (isHigh) {
            y -= speed;
        }
        else {
            // falling till the floor
            if (y < canvas.height - sizeHeight) {
                y++;
                if (y % 10 > 5) {
                    x++;
                }
                else {
                    x--;
                }
            }
            else {
                // here player is in the floor
                y = canvas.height - sizeHeight;
                if (isEmptyPocket()) {
                    exports.isLooser = true;
                }
            }
        }

        // decrease speed till zero
        if (speed > 0) {
            speed--;
        }
    }
    exports.moveLeft = function () {
        x -= 50;
        if (x < 0) {
            exports.moveRight();
        }
    }
    exports.moveRight = function () {
        x += 50;
        if (x > canvas.width - sizeWidth) {
            exports.moveLeft();
        }
    }

    // initialize player
    // also after every life
    exports.init({
        pocket: {
            tobacco: 3,
            alcohol: 3
        }
    });
    return exports;
};
