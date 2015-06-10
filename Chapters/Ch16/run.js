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
var canvas = document.querySelector("canvas");
var cx = canvas.getContext("2d");
var counterDiv = document.querySelector('#counter');
;
var results = [
    { name: "Satisfied", count: 1043, color: "lightblue" },
    { name: "Neutral", count: 563, color: "lightgreen" },
    { name: "Unsatisfied", count: 510, color: "pink" },
    { name: "No comment", count: 175, color: "silver" }
];
var startpos = new Vector(100, 100);
function flipHorizontally(context, around) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}
function trapezoid(height, bottomWidth, topwidth, start) {
    var inset = (bottomWidth - topwidth) / 2;
    var x = start.x, y = start.y;
    cx.beginPath();
    cx.moveTo(x, y); //Bottom left
    cx.lineTo(x += inset, y -= height); //Top left 
    cx.lineTo(x += topwidth, y); //Top right
    cx.lineTo(x += inset, y += height);
    cx.lineTo(start.x, start.y);
    cx.closePath;
    cx.stroke();
}
function redDiamond(height, width, start) {
    var x = start.x, y = start.y;
    cx.save();
    cx.rotate((Math.PI / 180) * 45);
    cx.fillStyle = "red";
    cx.fillRect(x, y, width, height);
    cx.restore();
}
function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length);
    if (length < 8)
        return;
    cx.save();
    cx.translate(0, length);
    cx.rotate(-angle);
    branch(length * scale, angle, scale);
    cx.rotate(2 * angle);
    branch(length * scale, angle, scale);
    cx.restore();
}
function run() {
    redDiamond(30, 30, startpos);
}
function mouseTrack(evt) {
    var x = evt.x;
    var y = evt.y;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    counterDiv.innerHTML = "X:" + x + " Y:" + y;
}
var throttled = false;
document.addEventListener("mousemove", function (evt) {
    if (!throttled) {
        throttled = true;
        mouseTrack(evt);
        setTimeout(function () { throttled = false; });
    }
});
run();
