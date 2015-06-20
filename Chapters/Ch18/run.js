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
var gameOfLife = (function () {
    function gameOfLife(container) {
        this.container = container;
        this.grid = [];
        for (var i = 0; i < 100; i++) {
            var c = document.createElement("input");
            c.type = "checkbox";
            c.checked = Math.random() >= 0.5 ? true : false;
            this.grid.push(c);
        }
    }
    /**draws the contents of the grid to the container */
    gameOfLife.prototype.draw = function () {
        var _this = this;
        this.grid.forEach(function (c) {
            return _this.container.appendChild(c);
        });
    };
    /** advances the game one 'turn' - recalculates state */
    gameOfLife.prototype.turn = function () {
        var tempgrid = [];
        this.grid.forEach(function (c, i, a) {
            var t = document.createElement('input');
            t.checked = checksquare(c, i, a);
            tempgrid.push(t);
        });
        this.grid = tempgrid;
    };
    return gameOfLife;
})();
//Any live cell with fewer than two or more than three live neighbors dies.
//Any live cell with two or three live neighbors lives on to the next generation.
//Any dead cell with exactly three live neighbors becomes a live cell.
function checksquare(e, i, a) {
    var c = e.checked;
    var checked = [];
    if (a[i - 1]) {
        checked.push(true);
    }
    if (a[i + 1]) {
        checked.push(true);
    }
    if (a[i + 9]) {
        checked.push(true);
    }
    if (a[i - 9]) {
        checked.push(true);
    }
    if (a[i + 11]) {
        checked.push(true);
    }
    if (a[i - 11]) {
        checked.push(true);
    }
    if (c) {
        if (checked.length < 2 || checked.length > 3) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        if (checked.length = 3) {
            return true;
        }
        return false;
    }
}
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
    var game = new gameOfLife(gameContainer);
    game.draw();
    var gamebtn = document.querySelector("#runGame");
    gamebtn.addEventListener("click", function () {
        game.turn();
    });
});
