///reference path="./all.d.ts"/>
var Controls;
(function (Controls) {
    function openURL(cx) {
        var input = Functions.elt("input", { type: "text" });
        var form = Functions.elt("form", null, "Open URL: ", input, Functions.elt("button", { type: "submit" }, "load"));
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            Functions.loadImageURL(cx, input.value);
        });
        return form;
    }
    Controls.openURL = openURL;
    ;
    function clear(cx) {
        var button = Functions.elt("button", { type: "submit" }, "clear");
        button.addEventListener('click', function () { cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height); });
        return button;
    }
    Controls.clear = clear;
    function tool(cx) {
        var select = Functions.elt("select");
        var toolkit = Tools.Tools;
        for (var name in toolkit)
            select.appendChild(Functions.elt("option", null, name));
        cx.canvas.addEventListener("mousedown", function (ev) {
            if (ev.which == 1) {
                toolkit[select.value](ev, cx);
                event.preventDefault();
            }
        });
        return Functions.elt("span", null, "Tool: ", select);
    }
    Controls.tool = tool;
    ;
    function openFile(cx) {
        var input = Functions.elt("input", { type: "file" });
        input.addEventListener("change", function () {
            if (input.files.length == 0)
                return;
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                Functions.loadImageURL(cx, reader.result);
            });
            reader.readAsDataURL(input.files[0]);
        });
        return Functions.elt("div", null, "Open file: ", input);
    }
    Controls.openFile = openFile;
    ;
    function brushSize(cx) {
        var select = Functions.elt("select");
        var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
        sizes.forEach(function (size) {
            select.appendChild(Functions.elt("option", { value: size }, size + " pixels"));
        });
        select.addEventListener("change", function () {
            cx.lineWidth = parseInt(select.value);
        });
        return Functions.elt("span", null, "Brush size: ", select);
    }
    Controls.brushSize = brushSize;
    ;
    function color(cx) {
        var input = Functions.elt("input", { type: "color" });
        input.addEventListener("change", function () {
            cx.fillStyle = input.value;
            cx.strokeStyle = input.value;
        });
        return Functions.elt("span", null, "Color: ", input);
    }
    Controls.color = color;
    ;
    function save(cx) {
        var link = Functions.elt("a", { href: "/" }, "Save");
        function update() {
            try {
                link.href = cx.canvas.toDataURL();
            }
            catch (e) {
                if (e instanceof Error)
                    link.href = "javascript:alert(" +
                        JSON.stringify("Can't save: " + e.toString()) + ")";
                else
                    throw e;
            }
        }
        link.addEventListener("mouseover", update);
        link.addEventListener("focus", update);
        return link;
    }
    Controls.save = save;
    ;
})(Controls || (Controls = {}));
///<reference path="./all.d.ts"/>
var Functions;
(function (Functions) {
    function randomPointInRadius(radius) {
        for (;;) {
            var x = Math.random() * 2 - 1;
            var y = Math.random() * 2 - 1;
            if (x * x + y * y <= 1)
                return new Objects.Vector(x * radius, y * radius);
        }
    }
    Functions.randomPointInRadius = randomPointInRadius;
    function loadImageURL(cx, url) {
        var image = document.createElement("img");
        image.addEventListener("load", function () {
            var color = cx.fillStyle, size = cx.lineWidth;
            cx.canvas.width = image.width;
            cx.canvas.height = image.height;
            cx.drawImage(image, 0, 0);
            cx.fillStyle = color;
            cx.strokeStyle = color;
            cx.lineWidth = size;
        });
        image.src = url;
    }
    Functions.loadImageURL = loadImageURL;
    function elt(name, attributes) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var node = document.createElement(name);
        if (attributes) {
            for (var attr in attributes)
                if (attributes.hasOwnProperty(attr))
                    node.setAttribute(attr, attributes[attr]);
        }
        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            if (typeof child == "string")
                child = document.createTextNode(child);
            node.appendChild(child);
        }
        return node;
    }
    Functions.elt = elt;
    /** Returns cursor position(x,y) relative to client bounding box */
    function relativePos(event, element) {
        var rect = element.getBoundingClientRect();
        return new Objects.Vector(Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top));
    }
    Functions.relativePos = relativePos;
    /** Takes a function and binds it to mousemove, takes an optional onEnd to attach something else */
    function trackDrag(onMove, onEnd) {
        function end(event) {
            removeEventListener("mousemove", onMove);
            removeEventListener("mouseup", end);
            if (onEnd)
                onEnd(event);
        }
        addEventListener("mousemove", onMove);
        addEventListener("mouseup", end);
    }
    Functions.trackDrag = trackDrag;
})(Functions || (Functions = {}));
///<reference path="./All.d.ts"/>
var Tools;
(function (Tools_1) {
    ;
    Tools_1.Tools = {
        line: function (event, cx, onEnd) {
            cx.lineCap = "round";
            var pos = Functions.relativePos(event, cx.canvas);
            var draw = function (event) {
                cx.beginPath();
                cx.moveTo(pos.x, pos.y);
                pos = Functions.relativePos(event, cx.canvas);
                cx.lineTo(pos.x, pos.y);
                cx.stroke();
            };
            Functions.trackDrag(draw, onEnd);
        },
        text: function (event, cx) {
            var text = prompt("Text:", "");
            if (text) {
                var pos = Functions.relativePos(event, cx.canvas);
                cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
                cx.fillText(text, pos.x, pos.y);
            }
        },
        erase: function (event, cx) {
            cx.globalCompositeOperation = "destination-out";
            Tools_1.Tools["line"](event, cx, function () {
                cx.globalCompositeOperation = "source-over";
            });
        },
        spray: function (event, cx) {
            var radius = cx.lineWidth / 2;
            var area = radius * radius * Math.PI;
            var dotsPerTick = Math.ceil(area / 30);
            var currentPos = Functions.relativePos(event, cx.canvas);
            var spray = setInterval(function () {
                for (var i = 0; i < dotsPerTick; i++) {
                    var offset = Functions.randomPointInRadius(radius);
                    cx.fillRect(currentPos.x + offset.x, currentPos.y + offset.y, 1, 1);
                }
            }, 25);
            Functions.trackDrag(function (event) {
                currentPos = Functions.relativePos(event, cx.canvas);
            }, function () {
                clearInterval(spray);
            });
        },
        rectangle: function (event, cx) {
            cx.lineCap = "round";
            //Get the start
            var pos = Functions.relativePos(event, cx.canvas);
            var size = new Objects.Vector(0, 0);
            var temprect = Functions.elt('Div', { class: 'tempRect' });
            document.body.appendChild(temprect);
            var getRect = function (event) {
                var newpos = Functions.relativePos(event, cx.canvas);
                size.y = newpos.y - pos.y;
                size.x = newpos.x - pos.x;
                temprect.style.left = pos.x + cx.canvas.parentElement.offsetLeft + "px";
                temprect.style.top = pos.y + cx.canvas.parentElement.offsetTop + "px";
                temprect.style.height = size.y + "px";
                temprect.style.width = size.x + "px";
            };
            var drawRect = function () {
                temprect.remove();
                cx.beginPath();
                cx.rect(pos.x, pos.y, size.x, size.y);
                cx.stroke();
            };
            Functions.trackDrag(getRect, drawRect);
        },
        colorPicker: function (event, cx) {
            try {
                var p = cx.getImageData(event.x, event.y, 1, 1).data;
                var rgb = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
                console.log('Hit the setColor function, ' + rgb);
                cx.fillStyle = rgb;
                cx.strokeStyle = rgb;
            }
            catch (ex) {
                if (ex.name == 'SecurityError') {
                    alert("Can't use that here...");
                }
                else {
                    throw new Error(ex);
                }
            }
        },
        floodFill: function (event, cx) {
            //Array of directions 
            var dirs = { "left": new Objects.Vector(-1, 0),
                "right": new Objects.Vector(1, 0),
                "up": new Objects.Vector(0, 1),
                "down": new Objects.Vector(0, -1)
            };
            var pos = Functions.relativePos(event, cx.canvas);
            var grid = cx.getImageData(0, 0, cx.canvas.width, cx.canvas.height).data;
            var targetColour = pixelColour(pos);
            var colored = [];
            var tocheck = [];
            //Converts a vector to an address on the imagedata.data
            function getAddress(pos) {
                return (pos.x + pos.y * cx.canvas.width) * 4;
            }
            //Returns a length 4 Uint8ClampedArray (RGBA) for a given vector
            function pixelColour(pos) {
                var t = getAddress(pos);
                return grid.subarray(t, t + 4);
            }
            // Look up down left right, record what was seen
            function fillscan(pos) {
                cx.fillRect(pos.x, pos.y, 1, 1);
                colored[pos.x * pos.y] = true;
                tocheck.shift();
                for (var d in dirs) {
                    var chk = pos.plus(dirs[d]);
                    if (!isChecked(chk)) {
                        if (isTarget(chk)) {
                            tocheck.push(chk);
                        }
                    }
                }
            }
            //Does the colour of a given cell match the one we're targeting
            function isTarget(pos) {
                return compareColour(targetColour, pixelColour(pos));
            }
            //Have we checked this one?
            function isChecked(chk) {
                return !colored[chk.x * chk.y] == undefined;
            }
            //Compares two pixelColours RGBA array
            function compareColour(px1, px2) {
                for (var i = 0; i < px1.length; i++) {
                    if (px1[i] != px2[i])
                        return false;
                }
                return true;
            }
            //Main loop   - L-R-U, L-R-D loop
            tocheck.push(pos);
            while (tocheck) {
                fillscan(tocheck[0]);
            }
            //Move
            //Check + ?colour
            //Mark results
            //Create a new grid of 15,000 where xy represents the address - store 1's for checked addresses
            // Check will be if newGrid((x*y)==1)
            console.log(pixelColour(pos));
        }
    };
})(Tools || (Tools = {}));
var Objects;
(function (Objects) {
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
    Objects.Vector = Vector;
})(Objects || (Objects = {}));
///<reference path="./All.d.ts"/>
function createPaint(parent) {
    var canvas = Functions.elt("canvas", { width: 500, height: 300 });
    var cx = canvas.getContext("2d");
    var toolbar = Functions.elt("div", { class: "toolbar" });
    for (var name in Controls)
        toolbar.appendChild(Controls[name](cx));
    var panel = Functions.elt("div", { class: "picturepanel" }, canvas);
    parent.appendChild(Functions.elt("div", null, panel, toolbar));
}
