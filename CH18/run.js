var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.move = function (v) {
        var x = this.x + v.x;
        var y = this.y + v.y;
        return new Vector(x, y);
    };
    Vector.prototype.plus = function (other) {
        return new Vector(this.x + other.x, this.y + other.y);
    };
    Vector.prototype.times = function (factor) {
        return new Vector(this.x * factor, this.y * factor);
    };
    return Vector;
})();
///<reference path="../Objects/Objects.ts"/>
function runCode(evt) {
    var codepane = document.querySelector('#code');
    var output = document.querySelector('#output');
    var code = codepane.innerHTML;
    var fun = new Function(code);
    try {
        var result = fun();
    }
    catch (err) {
        var result = err;
    }
    output.innerText = result;
}
/** takes an input element and an element for completions, reponds to input change **/
function autoComplete(evt, text, completions) {
    function clear() {
        while (completions.firstChild) {
            completions.removeChild(completions.firstChild);
        }
    }
    clear();
    if (!terms) {
        var terms = [];
        for (var name in window) {
            terms.push(name);
        }
    }
    var search = text.value;
    var hits = terms.filter(function (t) {
        return t.indexOf(search) > -1;
    });
    for (var i = 0; i < hits.length; i++) {
        var d = document.createElement("div");
        d.innerHTML = hits[i];
        d.addEventListener("click", function (evt) {
            var div = evt.currentTarget;
            text.value = div.innerHTML;
            clear();
        });
        completions.appendChild(d);
    }
}
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
var gameOfLife = (function () {
    function gameOfLife(container, width) {
        this.container = container;
        this.grid = [];
        this.width = width;
        for (var i = 0; i < (width * width); i++) {
            var c = document.createElement("input");
            c.type = "checkbox";
            c.checked = Math.random() >= 0.5 ? true : false;
            this.grid.push(c);
        }
    }
    /**draws the contents of the grid to the container */
    gameOfLife.prototype.draw = function () {
        var _this = this;
        //Clear
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        //Draw
        this.grid.forEach(function (c) {
            return _this.container.appendChild(c);
        });
    };
    gameOfLife.prototype.get = function (vec) {
        return this.grid[vec.x + this.width * vec.y];
    };
    ;
    gameOfLife.prototype.isInside = function (vec) {
        return vec.x >= 0 && vec.x < this.width &&
            vec.y >= 0 && vec.y < this.width;
    };
    ;
    /** Any live cell with fewer than two or more than three live neighbors dies.
    Any live cell with two or three live neighbors lives on to the next generation.
    Any dead cell with exactly three live neighbors becomes a live cell.*/
    gameOfLife.prototype.checksquare = function (sqr) {
        var live = this.get(sqr).checked;
        console.log(sqr.x + ' ' + sqr.y + ' ' + live);
        var checked = [];
        var res = true;
        for (var dir in directions) {
            var targ = sqr.plus(directions[dir]);
            if (this.isInside(targ) && this.get(targ).checked) {
                checked.push(true);
            }
        }
        if (live) {
            if (checked.length < 2 || checked.length > 3) {
                res = false;
            }
        }
        else {
            if (checked.length != 3) {
                res = false;
            }
        }
        return res;
    };
    /** advances the game one 'turn' - recalculates state */
    gameOfLife.prototype.turn = function () {
        var tempgrid = [];
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.width; j++) {
                var sqr = new Vector(j, i);
                var t = document.createElement('input');
                t.type = 'checkbox';
                t.checked = this.checksquare(sqr);
                tempgrid.push(t);
            }
        }
        this.grid = tempgrid;
        this.draw();
    };
    return gameOfLife;
})();
///<reference path="./Ch18.ts"/>
document.addEventListener("DOMContentLoaded", function (evt) {
    //Javascript workbench 
    var btn = document.querySelector('#button');
    btn.addEventListener('click', runCode);
    //Autocomplete 
    var searchbox = document.querySelector("#field");
    var completions = document.querySelector('#suggestions');
    searchbox.addEventListener("input", function (e) {
        autoComplete(e, searchbox, completions);
    });
    //Game of life 
    var gameContainer = document.querySelector("#gameoflife");
    var game = new gameOfLife(gameContainer, 10);
    game.draw();
    var gamebtn = document.querySelector("#runGame");
    gamebtn.addEventListener("click", function () {
        game.turn();
    });
});
