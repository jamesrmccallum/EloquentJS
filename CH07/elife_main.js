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
define("CH07/actionTypes", ["require", "exports", "CH07/creatures", "CH07/index"], function (require, exports, creatures_1, index_1) {
    "use strict";
    exports.actionTypes = {};
    //export var actionTypes = new Map<string,IActionFn>();
    exports.actionTypes["grow"] = function (critter) {
        critter.energy += 0.5;
        return true;
    };
    exports.actionTypes["move"] = function (c, v, a) {
        var dest = index_1.world.checkDestination(a, v);
        if (dest == null || c.energy <= 1 || index_1.world.grid.get(dest) != null)
            return false;
        c.energy -= 1;
        index_1.world.grid.set(v, null);
        index_1.world.grid.set(dest, c);
        return true;
    };
    exports.actionTypes["eat"] = function (c, v, a) {
        var dest = index_1.world.checkDestination(a, v);
        var atDest = dest != null && index_1.world.grid.get(dest);
        if (!atDest || atDest.energy == null)
            return false;
        c.energy += atDest.energy;
        index_1.world.grid.set(dest, null);
        return true;
    };
    exports.actionTypes["reproduce"] = function (c, v, a) {
        var baby = creatures_1.createCreature(index_1.world.legend, c.originChar);
        var dest = index_1.world.checkDestination(a, v);
        if (dest == null || c.energy <= 2 * baby.energy || index_1.world.grid.get(dest) != null)
            return false;
        c.energy -= 2 * baby.energy;
        index_1.world.grid.set(dest, baby);
        return true;
    };
});
///<reference path = "./all.d.ts" />
define("CH07/utilities", ["require", "exports", './Environment'], function (require, exports, Environment_1) {
    "use strict";
    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports.randomElement = randomElement;
    function charFromElement(element) {
        return element == null ? " " : element.originChar;
    }
    exports.charFromElement = charFromElement;
    function dirPlus(dir, n) {
        var index = Environment_1.directionNames.indexOf(dir);
        return Environment_1.directionNames[(index + n + 8) % 8];
    }
    exports.dirPlus = dirPlus;
});
define("CH07/creatures", ["require", "exports", "CH07/environment", "CH07/utilities"], function (require, exports, environment_1, utilities_1) {
    "use strict";
    var _this = this;
    ;
    var Creature = (function () {
        function Creature(spec, originChar) {
            this.spec = spec;
            this.originChar = originChar;
            this.act = spec.act;
            this.energy = spec.energy;
            this.direction = spec.direction;
            this.preySeen = spec.preySeen;
        }
        return Creature;
    }());
    exports.Creature = Creature;
    ;
    function createCreature(legend, ch) {
        if (ch == " ") {
            return null;
        }
        ;
        var s = exports.creatureSpecs[legend[ch]];
        return new Creature(s, ch);
    }
    exports.createCreature = createCreature;
    var specs = {};
    specs["Wall"] = {
        energy: null,
        direction: null,
        act: null
    };
    specs["PlantEater"] = {
        energy: 20,
        direction: "",
        act: function (v) {
            var space = v.find(" ");
            var plant = v.find("*");
            if (_this.energy > 60 && space)
                return { type: "reproduce", direction: space };
            if (plant)
                return { type: "eat", direction: plant };
            if (space)
                return { type: "move", direction: space };
        }
    };
    specs["WallFollower"] = {
        energy: 20,
        direction: "s",
        act: function (v) {
            var start = _this.direction;
            if (v.look(utilities_1.dirPlus(_this.direction, -3)) != null)
                start = _this.direction = utilities_1.dirPlus(_this.direction, -2);
            while (v.look(_this.direction) != null) {
                _this.direction = utilities_1.dirPlus(_this.direction, 1);
                if (_this.direction == start)
                    break;
            }
            return { type: "move", direction: _this.direction };
        }
    };
    specs["BouncingCritter"] = {
        energy: 20,
        direction: utilities_1.randomElement(environment_1.directionNames),
        act: function (v) {
            if (v.look(_this.direction) != null)
                _this.direction = v.find(" ") || "s";
            return { type: "move", direction: _this.direction };
        }
    };
    specs["Plant"] = {
        energy: 3 + Math.random() * 4,
        direction: '',
        act: function (v) {
            if (_this.energy > 15) {
                var space = v.find(" ");
                if (space)
                    return { type: "reproduce", direction: space };
            }
            if (_this.energy < 20)
                return { type: "grow", direction: null };
        }
    };
    specs["SmartPlantEater"] = {
        energy: 30,
        direction: "e",
        act: function (v) {
            var space = v.find(" "); //Never find space???... 
            var plants = v.findAll("*");
            if (_this.energy > 90 && space)
                return { type: "reproduce", direction: space };
            if (plants.length > 1)
                return { type: "eat", direction: utilities_1.randomElement(plants) };
            if (v.look(_this.direction) != null && space)
                _this.direction = space;
            return { type: "move", direction: _this.direction };
        }
    };
    specs["Tiger"] = {
        energy: 100,
        direction: "w",
        preySeen: new Array(0),
        act: function (v) {
            // Average number of prey seen per turn
            var seenPerTurn = _this.preySeen.reduce(function (a, b) {
                return a + b;
            }, 0) / _this.preySeen.length;
            var prey = v.findAll("O");
            var space = v.find(" ");
            _this.preySeen.push(prey.length);
            // Drop the first element from the array when it is longer than 6
            if (_this.preySeen.length > 6)
                _this.preySeen.shift();
            // Only eat if the predator saw more than ¼ prey animal per turn 
            if (prey.length && seenPerTurn > 0.25)
                return { type: "eat", direction: utilities_1.randomElement(prey) };
            if (_this.energy > 400 && space)
                return { type: "reproduce", direction: space };
            if (v.look(_this.direction) != null && space)
                _this.direction = space;
            return { type: "move", direction: _this.direction };
        },
    };
    exports.creatureSpecs = specs;
});
define("CH07/environment", ["require", "exports", "Objects/Objects", "CH07/creatures", "CH07/actionTypes", "CH07/utilities"], function (require, exports, Objects_1, creatures_2, actionTypes_1, utilities_2) {
    "use strict";
    var directions = {
        "n": new Objects_1.Vector(0, -1),
        "ne": new Objects_1.Vector(1, -1),
        "e": new Objects_1.Vector(1, 0),
        "se": new Objects_1.Vector(1, 1),
        "s": new Objects_1.Vector(0, 1),
        "sw": new Objects_1.Vector(-1, 1),
        "w": new Objects_1.Vector(-1, 0),
        "nw": new Objects_1.Vector(-1, -1)
    };
    exports.directionNames = Object.getOwnPropertyNames(directions);
    var World = (function () {
        /** pass a string array for a grid, and a string:string object which defines the character map */
        function World(map, legend) {
            this.legend = legend;
            var grid = new Grid(map[0].length, map.length);
            this.grid = grid;
            //Load the grid 
            map.forEach(function (line, y) {
                for (var x = 0; x < line.length; x++)
                    grid.set(new Objects_1.Vector(x, y), creatures_2.createCreature(legend, line[x]));
            });
        }
        // Let each creature 'act' in turn 
        World.prototype.turn = function () {
            var _this = this;
            var acted = [];
            this.grid.forEach(function (critter, vector) {
                if (critter.act && acted.indexOf(critter) == -1) {
                    acted.push(critter);
                    _this.letAct(critter, vector);
                }
            }, this);
        };
        World.prototype.letAct = function (critter, vector) {
            var at = actionTypes_1.actionTypes;
            var action = critter.act(new View(this, vector));
            var handled = action &&
                action.type in at &&
                at[action.type].call(this, critter, vector, action);
            if (!handled) {
                critter.energy -= 0.2;
                if (critter.energy <= 0)
                    this.grid.set(vector, null);
            }
        };
        //Is the requested direction inside the grid? 
        World.prototype.checkDestination = function (action, vector) {
            if (directions.hasOwnProperty(action.direction)) {
                var dest = vector.plus(directions[action.direction]);
                if (this.grid.isInside(dest))
                    return dest;
            }
        };
        World.prototype.toString = function () {
            var output = "";
            for (var y = 0; y < this.grid.height; y++) {
                for (var x = 0; x < this.grid.width; x++) {
                    var s = this.grid.get(new Objects_1.Vector(x, y)) == null ? ' ' : this.grid.get(new Objects_1.Vector(x, y)).originChar;
                    output += s;
                }
                output += "\n";
            }
            return output;
        };
        return World;
    }());
    exports.World = World;
    var Grid = (function () {
        function Grid(width, height) {
            this.space = new Array(width * height);
            this.width = width;
            this.height = height;
        }
        Grid.prototype.isInside = function (vector) {
            return vector.x >= 0 && vector.x < this.width &&
                vector.y >= 0 && vector.y < this.height;
        };
        Grid.prototype.get = function (vector) {
            var v = this.space[vector.x + this.width * vector.y];
            if (!v) {
                return null;
            }
            else {
                return v;
            }
        };
        Grid.prototype.set = function (vector, value) {
            this.space[vector.x + this.width * vector.y] = value;
        };
        Grid.prototype.forEach = function (f, context) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var value = this.space[x + y * this.width];
                    if (value != null)
                        f.call(context, value, new Objects_1.Vector(x, y));
                }
            }
        };
        return Grid;
    }());
    exports.Grid = Grid;
    var View = (function () {
        function View(world, vector) {
            this.world = world;
            this.vector = vector;
        }
        View.prototype.look = function (dir) {
            var target = this.vector.plus(directions[dir]);
            if (this, this.world.grid.isInside(target))
                return this.world.grid.get(target) == null ? null : this.world.grid.get(target);
        };
        View.prototype.findAll = function (ch) {
            var found = [];
            for (var dir in directions) {
                var f = this.look(dir);
                if ((f == null ? ' ' : f.originChar) == ch) {
                    found.push(dir);
                }
            }
            return found;
        };
        View.prototype.find = function (ch) {
            var found = this.findAll(ch);
            if (found.length == 0)
                return null;
            return utilities_2.randomElement(found);
        };
        return View;
    }());
    exports.View = View;
});
define("CH07/index", ["require", "exports", "CH07/environment"], function (require, exports, environment_2) {
    "use strict";
    var plan = ["####################################################",
        "#                 ####         ****              ###",
        "#   *     ##                 ########       OO    ##",
        "#   *    ##        O O                 ****       *#",
        "#       ##*       @                ##########     *#",
        "#      ##***  *         ****                     **#",
        "#* **  #  *  ***      #########                  **#",
        "#* **  #      *               #   *              **#",
        "#     ##              #   O   #  ***          ######",
        "#*                    #       #   *        O  #    #",
        "#*                    #  ######                 ** #",
        "###          ****          ***                  ** #",
        "#       O                        @         O       #",
        "#   *     ##  ##  ##  ##               ###      *  #",
        "#   **         #              *       #####  O     #",
        "##  **  O   O  #  #    ***  ***        ###      ** #",
        "###      @        #   *****                    ****#",
        "####################################################"];
    exports.world = new environment_2.World(plan, { "#": "Wall", "@": "Tiger", "O": "SmartPlantEater", "*": "Plant" });
    var active = null;
    var Animated = (function () {
        function Animated(world) {
            this.world = world;
            var outer = document.body;
            var doc = outer.ownerDocument;
            var node = outer.appendChild(doc.createElement("div"));
            var self = this;
            node.style.cssText = "position: relative; width: intrinsic; width: fit-content;";
            this.pre = node.appendChild(doc.createElement("pre"));
            this.pre.appendChild(doc.createTextNode(this.world.toString()));
            this.button = node.appendChild(doc.createElement("div"));
            this.button.style.cssText = "position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;";
            this.button.innerHTML = "stop";
            this.button.addEventListener("click", function () { self.clicked(); });
            this.disabled = false;
            if (active)
                active.disable();
            active = this;
            this.interval = setInterval(function () { self.tick(); }, 333);
        }
        Animated.prototype.clicked = function () {
            if (this.disabled)
                return;
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                this.button.innerHTML = "start";
            }
            else {
                var self = this;
                this.interval = setInterval(function () { self.tick(); }, 333);
                this.button.innerHTML = "stop";
            }
        };
        Animated.prototype.tick = function () {
            this.world.turn();
            this.pre.removeChild(this.pre.firstChild);
            this.pre.appendChild(this.pre.ownerDocument.createTextNode(this.world.toString()));
        };
        Animated.prototype.disable = function () {
            this.disabled = true;
            clearInterval(this.interval);
            this.button.innerHTML = "Disabled";
            this.button.style.color = "red";
        };
        return Animated;
    }());
    window["animateWorld"] = function () {
        new Animated(exports.world);
    };
});
