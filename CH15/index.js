define("Objects/Objects", ["require", "exports"], function (require, exports) {
    "use strict";
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
            this.x = x;
            this.y = y;
        }
        Vector.prototype.move = function (v) {
            var x = this.x + v.x;
            var y = this.y + v.y;
            return new Vector(x, y);
        };
        /**Return a new Vector which represents the old plus the new */
        Vector.prototype.plus = function (other) {
            return new Vector(this.x + other.x, this.y + other.y);
        };
        Vector.prototype.times = function (factor) {
            return new Vector(this.x * factor, this.y * factor);
        };
        return Vector;
    }());
    exports.Vector = Vector;
});
define("Ch15/SRC/DOMDisplay", ["require", "exports", "Ch15/SRC/Game"], function (require, exports, Game_1) {
    "use strict";
    var cfg = Game_1.gameConfig;
    var DOMDisplay = (function () {
        function DOMDisplay(parent, level) {
            this.level = level;
            this.wrap = parent.appendChild(elt("div", "game"));
            this.wrap.appendChild(this.drawBackground());
            this.actorLayer = null;
            this.drawFrame();
        }
        DOMDisplay.prototype.drawBackground = function () {
            var table = elt("table", "background");
            table.style.width = this.level.width * cfg.scale + "px";
            this.level.grid.forEach(function (row) {
                var rowElt = table.appendChild(elt("tr"));
                rowElt.style.height = cfg.scale + "px";
                row.forEach(function (type) {
                    rowElt.appendChild(elt("td", type));
                });
            });
            return table;
        };
        ;
        DOMDisplay.prototype.drawActors = function () {
            var wrap = elt("div");
            this.level.actors.forEach(function (a) {
                var rect = wrap.appendChild(elt("div", "actor " + a.type));
                rect.style.width = a.size.x * cfg.scale + "px";
                rect.style.height = a.size.y * cfg.scale + "px";
                rect.style.left = a.pos.x * cfg.scale + "px";
                rect.style.top = a.pos.y * cfg.scale + "px";
            });
            return wrap;
        };
        ;
        DOMDisplay.prototype.drawFrame = function (step) {
            if (this.actorLayer)
                this.wrap.removeChild(this.actorLayer);
            this.actorLayer = this.wrap.appendChild(this.drawActors());
            this.wrap.className = "game " + (this.level.status || "");
            this.scrollPlayerIntoView();
        };
        ;
        DOMDisplay.prototype.scrollPlayerIntoView = function () {
            var width = this.wrap.clientWidth;
            var height = this.wrap.clientHeight;
            var margin = width / 3;
            // The viewport
            var left = this.wrap.scrollLeft, right = left + width;
            var top = this.wrap.scrollTop, bottom = top + height;
            var player = this.level.player;
            var center = player.pos.plus(player.size.times(0.5)).times(cfg.scale);
            if (center.x < left + margin)
                this.wrap.scrollLeft = center.x - margin;
            else if (center.x > right - margin)
                this.wrap.scrollLeft = center.x + margin - width;
            if (center.y < top + margin)
                this.wrap.scrollTop = center.y - margin;
            else if (center.y > bottom - margin)
                this.wrap.scrollTop = center.y + margin - height;
        };
        ;
        DOMDisplay.prototype.clear = function () {
            this.wrap.parentNode.removeChild(this.wrap);
        };
        ;
        return DOMDisplay;
    }());
    exports.DOMDisplay = DOMDisplay;
});
define("Ch15/SRC/Game", ["require", "exports", "Ch15/SRC/Actors", "Ch15/SRC/Level", "Ch15/SRC/DOMDisplay"], function (require, exports, Actors_1, Level_1, DOMDisplay_1) {
    "use strict";
    var simpleLevelPlan = [
        "                      ",
        "                      ",
        "  x              = x  ",
        "  x         o o    x  ",
        "  x @      xxxxx   x  ",
        "  xxxxx            x  ",
        "      x!!!!!!!!!!!!x  ",
        "      xxxxxxxxxxxxxx  ",
        "                      "
    ];
    ;
    exports.actorChars = {
        "@": Actors_1.Player,
        "o": Actors_1.Coin,
        "=": Actors_1.Lava,
        "|": Actors_1.Lava,
        "v": Actors_1.Lava
    };
    // CONFIGURATION 
    var simpleLevel = new Level_1.Level(simpleLevelPlan);
    exports.gameConfig = {
        scale: 20,
        maxStep: 0.05,
        wobbleSpeed: 8,
        wobbleDist: 8,
        lives: 3,
        playerXSpeed: 7,
        gravity: 30,
        jumpSpeed: 17
    };
    var arrowCodes = { 37: "left", 38: "up", 39: "right", 27: "esc" };
    ;
    function trackKeys(codes) {
        var pressed = {};
        var handler = function (e) {
            if (codes[e.keyCode]) {
                var down = e.type == "keydown";
                pressed[codes[e.keyCode]] = down;
                e.preventDefault();
            }
        };
        addEventListener("keydown", handler);
        addEventListener("keyup", handler);
        return pressed;
    }
    function runAnimation(frameFunc) {
        var lastTime = null;
        function frame(time) {
            var stop = false;
            if (lastTime != null) {
                var timeStep = Math.min(time - lastTime, 100) / 1000;
                stop = frameFunc(timeStep) === false;
            }
            lastTime = time;
            if (!stop)
                requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    var arrows = trackKeys(arrowCodes);
    var pause = false;
    function runLevel(level, andThen) {
        var display = new DOMDisplay_1.DOMDisplay(document.body, level);
        runAnimation(function (step) {
            if (arrows["esc"]) {
                pause = !pause;
            }
            if (!pause) {
                level.animate(step, arrows);
                display.drawFrame(step);
                if (level.isFinished()) {
                    display.clear();
                    if (andThen) {
                        andThen(level.status);
                    }
                    return false;
                }
            }
        });
    }
    function runGame(plans) {
        var cfg = exports.gameConfig;
        var startLevel = function (n) {
            runLevel(new Level_1.Level(plans[n]), function (status) {
                if (cfg.lives > 0) {
                    if (status == "lost") {
                        cfg.lives -= 1;
                        startLevel(n);
                    }
                    else if (n < plans.length - 1 && cfg.lives > 0)
                        startLevel(n + 1);
                    else
                        console.log("You win!");
                }
                else {
                    startLevel(0);
                }
            });
        };
        startLevel(0);
    }
});
define("Ch15/SRC/Level", ["require", "exports", "Objects/Objects", "Ch15/SRC/Game"], function (require, exports, Objects_1, Game_2) {
    "use strict";
    var cfg = Game_2.gameConfig;
    var Level = (function () {
        function Level(plan) {
            this.width = plan[0].length;
            this.height = plan.length;
            this.grid = [];
            this.actors = [];
            for (var y = 0; y < this.height; y++) {
                var line = plan[y];
                var gridLine = [];
                for (var x = 0; x < this.width; x++) {
                    var ch = line[x], fieldType = null;
                    var Actor = Game_2.actorChars[ch];
                    if (Actor)
                        this.actors.push(new Actor(new Objects_1.Vector(x, y), ch));
                    else if (ch == "x")
                        fieldType = "wall";
                    else if (ch == "!")
                        fieldType = "lava";
                    gridLine.push(fieldType);
                }
                this.grid.push(gridLine);
            }
            this.player = this.actors.filter(function (a) {
                return a.type == "player";
            })[0];
            this.status = this.finishDelay = null;
        }
        Level.prototype.isFinished = function () {
            return this.status != null && this.finishDelay < 0;
        };
        Level.prototype.obstacleAt = function (pos, size) {
            var xStart = Math.floor(pos.x);
            var xEnd = Math.ceil(pos.x + size.x);
            var yStart = Math.floor(pos.y);
            var yEnd = Math.ceil(pos.y + size.y);
            if (xStart < 0 || xEnd > this.width || yStart < 0)
                return "wall";
            if (yEnd > this.height)
                return "lava";
            for (var y = yStart; y < yEnd; y++) {
                for (var x = xStart; x < xEnd; x++) {
                    var fieldType = this.grid[y][x];
                    if (fieldType)
                        return fieldType;
                }
            }
        };
        Level.prototype.actorAt = function (actor) {
            for (var i = 0; i < this.actors.length; i++) {
                var other = this.actors[i];
                if (other != actor &&
                    actor.pos.x + actor.size.x > other.pos.x &&
                    actor.pos.x < other.pos.x + other.size.x &&
                    actor.pos.y + actor.size.y > other.pos.y &&
                    actor.pos.y < other.pos.y + other.size.y)
                    return other;
            }
        };
        Level.prototype.playerTouched = function (type, actor) {
            if (type == "lava" && this.status == null) {
                this.status = "lost";
                this.finishDelay = 1;
            }
            else if (type == "coin") {
                this.actors = this.actors.filter(function (o) {
                    return o != actor;
                });
                if (!this.actors.some(function (a) {
                    return a.type == "coin";
                })) {
                    this.status = "won";
                    this.finishDelay = 1;
                }
            }
        };
        Level.prototype.animate = function (step, keys) {
            var _this = this;
            if (this.status != null)
                this.finishDelay -= step;
            while (step > 0) {
                var thisStep = Math.min(step, cfg.maxStep);
                this.actors.forEach(function (a) {
                    a.act(thisStep, _this, keys);
                }, this);
                step -= thisStep;
            }
        };
        ;
        return Level;
    }());
    exports.Level = Level;
});
define("Ch15/SRC/Actors", ["require", "exports", "Objects/Objects", "Ch15/SRC/Game"], function (require, exports, Objects_2, Game_3) {
    "use strict";
    var cfg = Game_3.gameConfig;
    var Player = (function () {
        function Player(pos) {
            this.pos = pos.plus(new Objects_2.Vector(0, -0.5));
            this.size = new Objects_2.Vector(0.8, 1.5),
                this.type = "player",
                this.speed = new Objects_2.Vector(0, 0);
        }
        Player.prototype.moveX = function (step, level, keys) {
            this.speed.x = 0;
            if (keys["left"])
                this.speed.x -= cfg.playerXSpeed;
            if (keys["right"])
                this.speed.x += cfg.playerXSpeed;
            var motion = new Objects_2.Vector(this.speed.x * step, 0);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            if (obstacle)
                level.playerTouched(obstacle);
            else
                this.pos = newPos;
        };
        ;
        Player.prototype.moveY = function (step, level, keys) {
            this.speed.y += step * cfg.gravity;
            var motion = new Objects_2.Vector(0, this.speed.y * step);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            if (obstacle) {
                level.playerTouched(obstacle);
                if (keys["up"] && this.speed.y > 0)
                    this.speed.y = -cfg.jumpSpeed;
                else
                    this.speed.y = 0;
            }
            else {
                this.pos = newPos;
            }
        };
        ;
        Player.prototype.act = function (step, level, keys) {
            this.moveX(step, level, keys);
            this.moveY(step, level, keys);
            var otherActor = level.actorAt(this);
            if (otherActor)
                level.playerTouched(otherActor.type, otherActor);
            // Losing animation
            if (level.status == "lost") {
                this.pos.y += step;
                this.size.y -= step;
            }
        };
        ;
        return Player;
    }());
    exports.Player = Player;
    var Lava = (function () {
        function Lava(pos, ch) {
            var s;
            if (ch == "=") {
                s = new Objects_2.Vector(2, 0);
            }
            else if (ch == "|") {
                s = new Objects_2.Vector(0, 2);
            }
            else if (ch == "v") {
                s = new Objects_2.Vector(0, 3);
                this.repeatPos = pos;
            }
            this.pos = pos;
            this.size = new Objects_2.Vector(1, 1);
            this.type = "lava";
            this.speed = s;
        }
        Lava.prototype.act = function (step, level) {
            var newPos = this.pos.plus(this.speed.times(step));
            if (!level.obstacleAt(newPos, this.size))
                this.pos = newPos;
            else if (this.repeatPos)
                this.pos = this.repeatPos;
            else
                this.speed = this.speed.times(-1);
        };
        ;
        return Lava;
    }());
    exports.Lava = Lava;
    var Coin = (function () {
        function Coin(pos) {
            this.pos = pos,
                this.size = new Objects_2.Vector(0.6, 0.6);
            this.type = "coin";
            this.basePos = this.pos = pos.plus(new Objects_2.Vector(0.2, 0.1));
            this.wobble = Math.random() * Math.PI * 2;
        }
        Coin.prototype.act = function (step) {
            this.wobble += step * cfg.wobbleSpeed;
            var wobblePos = Math.sin(this.wobble) * cfg.wobbleDist;
            this.pos = this.basePos.plus(new Objects_2.Vector(0, wobblePos));
        };
        ;
        return Coin;
    }());
    exports.Coin = Coin;
});
define("Ch15/index", ["require", "exports", "Ch15/SRC/Actors", "Ch15/SRC/Level", "Ch15/SRC/DOMDisplay"], function (require, exports, Actors_2, Level_2, DOMDisplay_2) {
    "use strict";
    var simpleLevelPlan = [
        "                      ",
        "                      ",
        "  x              = x  ",
        "  x         o o    x  ",
        "  x @      xxxxx   x  ",
        "  xxxxx            x  ",
        "      x!!!!!!!!!!!!x  ",
        "      xxxxxxxxxxxxxx  ",
        "                      "
    ];
    ;
    exports.actorChars = {
        "@": Actors_2.Player,
        "o": Actors_2.Coin,
        "=": Actors_2.Lava,
        "|": Actors_2.Lava,
        "v": Actors_2.Lava
    };
    // CONFIGURATION 
    var simpleLevel = new Level_2.Level(simpleLevelPlan);
    exports.gameConfig = {
        scale: 20,
        maxStep: 0.05,
        wobbleSpeed: 8,
        wobbleDist: 8,
        lives: 3,
        playerXSpeed: 7,
        gravity: 30,
        jumpSpeed: 17
    };
    var arrowCodes = { 37: "left", 38: "up", 39: "right", 27: "esc" };
    ;
    function trackKeys(codes) {
        var pressed = {};
        var handler = function (e) {
            if (codes[e.keyCode]) {
                var down = e.type == "keydown";
                pressed[codes[e.keyCode]] = down;
                e.preventDefault();
            }
        };
        addEventListener("keydown", handler);
        addEventListener("keyup", handler);
        return pressed;
    }
    function runAnimation(frameFunc) {
        var lastTime = null;
        function frame(time) {
            var stop = false;
            if (lastTime != null) {
                var timeStep = Math.min(time - lastTime, 100) / 1000;
                stop = frameFunc(timeStep) === false;
            }
            lastTime = time;
            if (!stop)
                requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    var arrows = trackKeys(arrowCodes);
    var pause = false;
    function runLevel(level, andThen) {
        var display = new DOMDisplay_2.DOMDisplay(document.body, level);
        runAnimation(function (step) {
            if (arrows["esc"]) {
                pause = !pause;
            }
            if (!pause) {
                level.animate(step, arrows);
                display.drawFrame(step);
                if (level.isFinished()) {
                    display.clear();
                    if (andThen) {
                        andThen(level.status);
                    }
                    return false;
                }
            }
        });
    }
    function runGame(plans) {
        var cfg = exports.gameConfig;
        var startLevel = function (n) {
            runLevel(new Level_2.Level(plans[n]), function (status) {
                if (cfg.lives > 0) {
                    if (status == "lost") {
                        cfg.lives -= 1;
                        startLevel(n);
                    }
                    else if (n < plans.length - 1 && cfg.lives > 0)
                        startLevel(n + 1);
                    else
                        console.log("You win!");
                }
                else {
                    startLevel(0);
                }
            });
        };
        startLevel(0);
    }
});
