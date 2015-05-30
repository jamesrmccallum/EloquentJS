var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.plus = function (v) {
        var x = this.x + v.x;
        var y = this.y + v.y;
        return new Vector(x, y);
    };
    return Vector;
})();
//Functions 
var utilities;
(function (utilities) {
    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    utilities.randomElement = randomElement;
    function charFromElement(element) {
        if (element == null)
            return " ";
        else
            return element.originChar;
    }
    utilities.charFromElement = charFromElement;
    function dirPlus(dir, n) {
        var index = directionNames.indexOf(dir);
        return directionNames[(index + n + 8) % 8];
    }
    utilities.dirPlus = dirPlus;
})(utilities || (utilities = {}));
var directions = {
    "n": new Vector(0, -1),
    "ne": new Vector(1, -1),
    "e": new Vector(1, 0),
    "se": new Vector(1, 1),
    "s": new Vector(0, 1),
    "sw": new Vector(-1, 1),
    "w": new Vector(-1, 0),
    "nw": new Vector(-1, -1)
};
var directionNames = Object.getOwnPropertyNames(directions);
///<reference path="creatures.ts"/>
var actionTypes = {};
actionTypes["grow"] = function (critter) {
    critter.energy += 0.5;
    return true;
};
actionTypes["move"] = function (critter, vector, action) {
    var dest = world.checkDestination(action, vector);
    if (dest == null || critter.energy <= 1 || world.grid.get(dest) != null)
        return false;
    critter.energy -= 1;
    world.grid.set(vector, null);
    world.grid.set(dest, critter);
    return true;
};
actionTypes["eat"] = function (critter, vector, action) {
    var dest = world.checkDestination(action, vector);
    var atDest = dest != null && world.grid.get(dest);
    if (!atDest || atDest.energy == null)
        return false;
    critter.energy += atDest.energy;
    world.grid.set(dest, null);
    return true;
};
actionTypes["reproduce"] = function (critter, vector, action) {
    var baby = createCreature(this.legend, critter.originChar);
    var dest = world.checkDestination(action, vector);
    if (dest == null || critter.energy <= 2 * baby.energy || world.grid.get(dest) != null)
        return false;
    critter.energy -= 2 * baby.energy;
    world.grid.set(dest, baby);
    return true;
};
///<reference path="creatures.ts"/>
///<reference path="actionTypes.ts"/>
var World = (function () {
    function World(map, legend) {
        var grid = new Grid(map[0].length, map.length);
        this.grid = grid;
        this.legend = legend;
        //Load the grid 
        map.forEach(function (line, y) {
            for (var x = 0; x < line.length; x++)
                grid.set(new Vector(x, y), createCreature(legend, line[x]));
        });
    }
    // Let each creature 'act' in turn 
    World.prototype.turn = function () {
        var acted = [];
        this.grid.forEach(function (critter, vector) {
            if (critter.act && acted.indexOf(critter) == -1) {
                acted.push(critter);
                this.letAct(critter, vector);
            }
        }, this);
    };
    World.prototype.letAct = function (critter, vector) {
        var action = critter.act(new View(this, vector));
        var handled = action &&
            action.type in actionTypes &&
            actionTypes[action.type].call(this, critter, vector, action);
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
                var s = this.grid.get(new Vector(x, y)) == null ? ' ' : this.grid.get(new Vector(x, y)).originChar;
                output += s;
            }
            output += "\n";
        }
        return output;
    };
    return World;
})();
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
                    f.call(context, value, new Vector(x, y));
            }
        }
    };
    return Grid;
})();
var View = (function () {
    function View(world, vector) {
        this.world = world;
        this.vector = vector;
    }
    View.prototype.look = function (dir) {
        var target = this.vector.plus(directions[dir]);
        if (this, world.grid.isInside(target))
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
        return utilities.randomElement(found);
    };
    return View;
})();
///<reference path="environment.ts"/>
;
var Creaturespecs = {};
var creature = (function () {
    function creature(spec, originChar) {
        this.spec = spec;
        this.act = spec.act;
        this.energy = spec.energy;
        this.direction = spec.direction;
        this.originChar = originChar;
        this.preySeen = spec.preySeen;
    }
    return creature;
})();
;
function createCreature(legend, ch) {
    if (ch == " ")
        return null;
    var s = Creaturespecs[legend[ch]];
    var c = new creature(s, ch);
    return c;
}
Creaturespecs["Wall"] = {
    energy: null,
    direction: null,
    act: null
};
Creaturespecs["PlantEater"] = {
    energy: 20,
    direction: "",
    act: function (view) {
        var space = view.find(" ");
        if (this.energy > 60 && space)
            return { type: "reproduce", direction: space };
        var plant = view.find("*");
        if (plant)
            return { type: "eat", direction: plant };
        if (space)
            return { type: "move", direction: space };
    }
};
Creaturespecs["WallFollower"] = {
    energy: 20,
    direction: "s",
    act: function (view) {
        var start = this.direction;
        if (view.look(utilities.dirPlus(this.direction, -3)) != null)
            start = this.direction = utilities.dirPlus(this.direction, -2);
        while (view.look(this.direction) != null) {
            this.direction = utilities.dirPlus(this.direction, 1);
            if (this.direction == start)
                break;
        }
        return { type: "move", direction: this.direction };
    }
};
Creaturespecs["BouncingCritter"] = {
    energy: 20,
    direction: utilities.randomElement(directionNames),
    act: function (view) {
        if (view.look(this.direction) != null)
            this.direction = view.find(" ") || "s";
        return { type: "move", direction: this.direction };
    }
};
Creaturespecs["Plant"] = {
    energy: 3 + Math.random() * 4,
    direction: '',
    act: function (view) {
        if (this.energy > 15) {
            var space = view.find(" ");
            if (space)
                return { type: "reproduce", direction: space };
        }
        if (this.energy < 20)
            return { type: "grow", direction: null };
    }
};
Creaturespecs["SmartPlantEater"] = {
    energy: 30,
    direction: "e",
    act: function (view) {
        var space = view.find(" "); //Never find space???... 
        if (this.energy > 90 && space)
            return { type: "reproduce", direction: space };
        var plants = view.findAll("*");
        if (plants.length > 1)
            return { type: "eat", direction: utilities.randomElement(plants) };
        if (view.look(this.direction) != null && space)
            this.direction = space;
        return { type: "move", direction: this.direction };
    }
};
Creaturespecs["Tiger"] = {
    energy: 100,
    direction: "w",
    preySeen: new Array(0),
    act: function (view) {
        // Average number of prey seen per turn
        var seenPerTurn = this.preySeen.reduce(function (a, b) {
            return a + b;
        }, 0) / this.preySeen.length;
        var prey = view.findAll("O");
        this.preySeen.push(prey.length);
        if (this.preySeen.length > 6)
            this.preySeen.shift();
        if (prey.length && seenPerTurn > 0.25)
            return { type: "eat", direction: utilities.randomElement(prey) };
        var space = view.find(" ");
        if (this.energy > 400 && space)
            return { type: "reproduce", direction: space };
        if (view.look(this.direction) != null && space)
            this.direction = space;
        return { type: "move", direction: this.direction };
    },
};
///<reference path="config.ts"/>
///<reference path="creatures.ts"/>
///<reference path="actionTypes.ts"/>
///<reference path="environment.ts"/>
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
var world = new World(plan, { "#": "Wall", "@": "Tiger", "O": "SmartPlantEater", "*": "Plant" });
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
        this.pre.appendChild(doc.createTextNode(world.toString()));
        this.button = node.appendChild(doc.createElement("div"));
        this.button.style.cssText = "position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; " +
            "background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;";
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
})();
window["animateWorld"] = function () {
    new Animated(this.world);
};
