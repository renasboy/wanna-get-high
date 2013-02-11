window.onload = function () {

    // emulating requestAnimationFrame
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                      window.mozRequestAnimationFrame ||
                                      window.msRequestAnimationFrame ||
                                      window.oRequestAnimationFrame ||
                                      function (callback) {
                                        return window.setTimeout(callback, 17 /*~ 1000/60*/);
                                      });
    }

    // emulating cancelAnimationFrame
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
                                     window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                                     window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                                     window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
                                     window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                                     window.clearTimeout);
    }

    // GLOBALS
    var canvas      = document.getElementById('game-canvas');
    var context     = canvas.getContext('2d');
    canvas.width    = 360;
    canvas.height   = 640;

    // all highs
    var tobacco     = new High({
        name: 'tobacco',
        icon: 0,
        tolerance: 1,
        delay: 100,
        speed: 5,
        duration: 1500,
        effects: {
            blur: 0
        }
    });
    var alcohol     = new High({
        name: 'alcohol',
        icon: 1,
        tolerance: 2,
        delay: 300,
        speed: 15,
        duration: 4000,
        effects: {
            blur: 2
        }
    });
    var marijuana   = new High({
        name: 'marijuana',
        icon: 2,
        tolerance: 3,
        delay: 200,
        speed: 10,
        duration: 4000,
        effects: {
            blur: 1
        }
    });
    var cocaine     = new High({
        name: 'cocaine',
        icon: 3,
        tolerance: 4,
        delay: 50,
        speed: 30,
        duration: 500,
        effects: {
        }
    });
    var heroine     = new High({
        name: 'heroine',
        icon: 4,
        tolerance: 10,
        delay: 0,
        speed: 55,
        duration: 500,
        effects: {
            blur: 2
        }
    });
    var ecstasy     = new High({
        name: 'ecstasy',
        icon: 5,
        tolerance: 8,
        delay: 2000,
        speed: 25,
        duration: 6000,
        effects: {
            blur: 0,
            brightness: -10,
        }
    });
    var lsd         = new High({
        name: 'lsd',
        icon: 6,
        tolerance: 9,
        delay: 2000,
        speed: 20,
        duration: 5000,
        effects: {
            invert: 1
        }
    });
    var psilocybin  = new High({
        name: 'psilocybin',
        icon: 7,
        tolerance: 9,
        delay: 2000,
        speed: 15,
        duration: 5000,
        effects: {
            blur: 1,
            invert: 1
        }
    });

    var player      = new Player({
        canvas: canvas,
        context: context
    });
    var game        = new Game({
        canvas: canvas,
        context: context,
        player: player,
        highs: {
            '67': cocaine,      // C
            '65': alcohol,      // A
            '77': marijuana,    // M
            '84': tobacco,      // T
            '72': heroine,      // H
            '69': ecstasy,      // E
            '76': lsd,          // L
            '80': psilocybin    // P
        }
    });
}
