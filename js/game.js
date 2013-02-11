var Game = function (options) {
    // get options
    var canvas  = options.canvas;
    var context = options.context;
    var player  = options.player;
    var highs   = options.highs;

    var exports = {};

    var showLevel   = false;
    var level       = 1;

    var over        = false;
    var won         = false;

    var welcome     = new Audio('sounds/wanna_get_high.wav');
    welcome.play();

    var goodbye     = new Audio('sounds/bring_a_towel.wav');

    var bg          = new Image();
    bg.src          = 'images/bg.jpg';

    var gameOverBg  = new Image();
    gameOverBg.src  = 'images/game_over.png';

    var gameWonBg  = new Image();
    gameWonBg.src  = 'images/game_won.png';

    var highIcons   = new Image();
    highIcons.src   = 'images/high_sprite.png';

    // THIS IS THE GAME LOGIC
    step = function () {
        player.update();
        if (player.reachedTop() === true) {
            won     = true;
        }
        if (player.isLooser === true) {
            if (player.getLives() > 0) {
                player.useLive();
                reset();
            }
            else {
                // GAME OVER !!!
                over    = true;
            }
        }
        stepLoop = window.requestAnimationFrame(step, canvas);
        render();
    }
    function keyboard (e) {
        if (highs[e.keyCode]) {
            if (player.hasInPocket(highs[e.keyCode]) > 0) {
                player.getHigh(highs[e.keyCode]);
            }
        }
        else if (e.keyCode == 37) {
            player.moveLeft();
        }
        else if (e.keyCode == 39) {
            player.moveRight();
        }
    }

    window.addEventListener('keydown', keyboard, false);
    var stepLoop = window.requestAnimationFrame(step, canvas);

    function reset () {
        startLevel();
        over        = false;
        won         = false;
    }

    function startLevel() {
        showLevel   = true;
        setTimeout(function () { showLevel = false; }, 2000);
        player.init({
            pocket: getLevelPocket()
        });
    }

    function getLevelPocket() {
        switch (level) {
            case 1:
                return {
                    tobacco: 3,
                    alcohol: 3
                };
            break;

            case 2:
                return {
                    tobacco: 3,
                    alcohol: 2,
                    marijuana: 1
                };
            break;

            case 3:
                return {
                    tobacco: 3,
                    alcohol: 1,
                    marijuana: 2
                };
            break;

            case 4:
                return {
                    tobacco: 3,
                    alcohol: 1,
                    marijuana: 1,
                    cocaine: 1
                };
            break;

            case 5:
                return {
                    tobacco: 3,
                    alcohol: 0,
                    marijuana: 2,
                    cocaine: 2
                };
            break;

            case 6:
                return {
                    tobacco: 3,
                    alcohol: 0,
                    marijuana: 2,
                    cocaine: 1,
                    ecstasy: 1,
                };
            break;
        }
    }

    function gameOver () {
        window.cancelAnimationFrame(stepLoop);
        clear();
        canvas.style.polyfilter = 'none';
        context.drawImage(gameOverBg, 0, 0);
        goodbye.play();
    }

    function gameWon () {
        // if there are no more levels defined
        level++;
        if (getLevelPocket()) {
            reset();
            return;
        }
        window.cancelAnimationFrame(stepLoop);
        clear();
        canvas.style.polyfilter = 'none';
        context.drawImage(gameWonBg, 0, 0);
    }

    /*
    bmp = new createjs.Bitmap(bg);
    bmp.cache(0, 0, bg.width, bg.height);
    
    stage = new createjs.Stage(canvas);
    stage.addChild(bmp);
    */

    function clear () {
        /*
        var brightnessValue     = 0;
        var contrastValue       = 0;
        var saturationValue     = 0;
        var hueValue            = 0;
        var blurXValue          = 0;
        var blurYValue          = 0;
        var redChannelvalue     = 255;
        var greenChannelValue   = 255;
        var blueChannelValue    = 255;

        cm = new createjs.ColorMatrix();
        cm.adjustColor(brightnessValue, contrastValue, saturationValue, hueValue);

        colorFilter = new createjs.ColorMatrixFilter(cm);
        blurFilter = new createjs.BoxBlurFilter(blurXValue,  blurYValue, 2);
        redChannelFilter = new createjs.ColorFilter(redChannelvalue/255,1,1,1);
        greenChannelFilter = new createjs.ColorFilter(1,greenChannelValue/255,1,1);
        blueChannelFilter = new createjs.ColorFilter(1,1,blueChannelValue/255,1);
        bmp.filters = [colorFilter, blurFilter, redChannelFilter, greenChannelFilter, blueChannelFilter];

        bmp.updateCache();
        stage.update();
        */
        context.drawImage(bg, 0, 0);
    }

    function drawLevel () {
        context.fillStyle = 'rgb(0, 0, 0, 0.8)';
        context.font = '50px Helvetica';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText('Level ' + level, 100, 300);
    }

    function drawPocket () {
        context.fillStyle = 'rgb(0, 0, 0)';
        context.font = '8px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        var icon = 24;
        for (var key in highs) {
            context.drawImage(highIcons, highs[key].icon * icon, 0, icon, icon, highs[key].icon * 42 + 20, 10, icon, icon);
            context.fillText(player.hasInPocket(highs[key]), highs[key].icon * 42 + 25 + 20, 10 + 18);
        }
    }

    function drawSpeed () {
        context.fillStyle = 'rgb(0, 0, 0)';
        context.font = '15px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText('Speed: ' + player.getSpeed(), 20, 45);
        context.fillText('Target: ' + player.getHeight(), 100, 45);
    }

    var playerImage = new Image();
    playerImage.src = 'images/player_sprite.png'

    function drawLives () {
        for (i = 0; i < player.getLives(); i++) {
            context.drawImage(playerImage, 44, 0, 44, 60, 300 + (15 * i), 45, 11, 15);
        }
    }

    // GRAPHICS UPDATE
    function render () {
        clear();

        player.draw();
        drawPocket();
        drawSpeed();
        drawLives();

        if (over === true) {
            gameOver();
        }
        else if (won === true) {
            gameWon();
        }
        else if (showLevel === true) {
            drawLevel();
        }
    }
    
    startLevel();

    return exports;
};
