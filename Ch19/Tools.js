System.register(['../Objects/Objects', './Functions'], function(exports_1) {
    "use strict";
    var Objects_1, Functions_1;
    var Tools;
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            },
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            }],
        execute: function() {
            ;
            exports_1("Tools", Tools = {
                line: (event, cx, onEnd) => {
                    cx.lineCap = "round";
                    var pos = Functions_1.relativePos(event, cx.canvas);
                    var draw = (event) => {
                        cx.beginPath();
                        cx.moveTo(pos.x, pos.y);
                        pos = Functions_1.relativePos(event, cx.canvas);
                        cx.lineTo(pos.x, pos.y);
                        cx.stroke();
                    };
                    Functions_1.trackDrag(draw, onEnd);
                },
                text: (event, cx) => {
                    var text = prompt("Text:", "");
                    if (text) {
                        var pos = Functions_1.relativePos(event, cx.canvas);
                        cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
                        cx.fillText(text, pos.x, pos.y);
                    }
                },
                erase: (event, cx) => {
                    cx.globalCompositeOperation = "destination-out";
                    Tools["line"](event, cx, () => {
                        cx.globalCompositeOperation = "source-over";
                    });
                },
                spray: (event, cx) => {
                    var radius = cx.lineWidth / 2;
                    var area = radius * radius * Math.PI;
                    var dotsPerTick = Math.ceil(area / 30);
                    var currentPos = Functions_1.relativePos(event, cx.canvas);
                    var spray = setInterval(() => {
                        for (var i = 0; i < dotsPerTick; i++) {
                            var offset = Functions_1.randomPointInRadius(radius);
                            cx.fillRect(currentPos.x + offset.x, currentPos.y + offset.y, 1, 1);
                        }
                    }, 25);
                    Functions_1.trackDrag((event) => {
                        currentPos = Functions_1.relativePos(event, cx.canvas);
                    }, () => {
                        clearInterval(spray);
                    });
                },
                rectangle: (event, cx) => {
                    cx.lineCap = "round";
                    //Get the start
                    var pos = Functions_1.relativePos(event, cx.canvas);
                    var size = new Objects_1.Vector(0, 0);
                    var temprect = Functions_1.elt('Div', { class: 'tempRect' });
                    document.body.appendChild(temprect);
                    var getRect = (event) => {
                        var newpos = Functions_1.relativePos(event, cx.canvas);
                        size.y = newpos.y - pos.y;
                        size.x = newpos.x - pos.x;
                        temprect.style.left = pos.x + cx.canvas.parentElement.offsetLeft + "px";
                        temprect.style.top = pos.y + cx.canvas.parentElement.offsetTop + "px";
                        temprect.style.height = size.y + "px";
                        temprect.style.width = size.x + "px";
                    };
                    var drawRect = () => {
                        temprect.remove();
                        cx.beginPath();
                        cx.rect(pos.x, pos.y, size.x, size.y);
                        cx.stroke();
                    };
                    Functions_1.trackDrag(getRect, drawRect);
                },
                colorPicker: (event, cx) => {
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
                floodFill: (event, cx) => {
                    //Array of directions 
                    var dirs = { "left": new Objects_1.Vector(-1, 0),
                        "right": new Objects_1.Vector(1, 0),
                        "up": new Objects_1.Vector(0, 1),
                        "down": new Objects_1.Vector(0, -1)
                    };
                    var pos = Functions_1.relativePos(event, cx.canvas);
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
                    /** Does the colour of a given cell match the one we're targeting?*/
                    function isTarget(pos) {
                        return compareColour(targetColour, pixelColour(pos));
                    }
                    /**  Have we checked this one? */
                    function isChecked(chk) {
                        return !colored[chk.x * chk.y] == undefined;
                    }
                    /**  Compares two pixelColours RGBA array */
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
                    console.log(pixelColour(pos));
                }
            });
        }
    }
});
