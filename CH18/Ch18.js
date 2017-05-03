System.register(['../Objects/Objects'], function(exports_1) {
    "use strict";
    var Objects_1;
    var directions, gameOfLife;
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
    exports_1("runCode", runCode);
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
    exports_1("autoComplete", autoComplete);
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            }],
        execute: function() {
            directions = {
                "n": new Objects_1.Vector(0, -1),
                "ne": new Objects_1.Vector(1, -1),
                "e": new Objects_1.Vector(1, 0),
                "se": new Objects_1.Vector(1, 1),
                "s": new Objects_1.Vector(0, 1),
                "sw": new Objects_1.Vector(-1, 1),
                "w": new Objects_1.Vector(-1, 0),
                "nw": new Objects_1.Vector(-1, -1)
            };
            class gameOfLife {
                constructor(container, width) {
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
                draw() {
                    //Clear
                    while (this.container.firstChild) {
                        this.container.removeChild(this.container.firstChild);
                    }
                    //Draw
                    this.grid.forEach(c => this.container.appendChild(c));
                }
                get(vec) {
                    return this.grid[vec.x + this.width * vec.y];
                }
                ;
                isInside(vec) {
                    return vec.x >= 0 && vec.x < this.width &&
                        vec.y >= 0 && vec.y < this.width;
                }
                ;
                /** Any live cell with fewer than two or more than three live neighbors dies.
                Any live cell with two or three live neighbors lives on to the next generation.
                Any dead cell with exactly three live neighbors becomes a live cell.*/
                checksquare(sqr) {
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
                }
                /** advances the game one 'turn' - recalculates state */
                turn() {
                    var tempgrid = [];
                    for (var i = 0; i < this.width; i++) {
                        for (var j = 0; j < this.width; j++) {
                            var sqr = new Objects_1.Vector(j, i);
                            var t = document.createElement('input');
                            t.type = 'checkbox';
                            t.checked = this.checksquare(sqr);
                            tempgrid.push(t);
                        }
                    }
                    this.grid = tempgrid;
                    this.draw();
                }
            }
            gameOfLife = gameOfLife;
        }
    }
});
