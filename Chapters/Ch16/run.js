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
var Ball = (function () {
    function Ball(pos, context, radius) {
        this._pos = pos;
        this.xbound = context.canvas.width;
        this.ybound = context.canvas.height;
        this.context = context;
        this.radius = radius;
    }
    Object.defineProperty(Ball.prototype, "pos", {
        get: function () {
            return this._pos;
        },
        set: function (pos) {
            this._pos = pos;
        },
        enumerable: true,
        configurable: true
    });
    Ball.prototype.move = function () {
        this.pos.plus();
    };
    Ball.prototype.draw = function () {
        this.context.beginPath();
        this.context.arc(this._pos.x, this._pos.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = 'red';
        this.context.fill();
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    };
    return Ball;
})();
function bouncingBall(cx) {
    var boxPos = new Vector(10, 10);
    var ballPos = new Vector(80, 80);
    var lastTime = null;
    var ball = new Ball(ballPos, cx, 20);
    function frame(time) {
        if (lastTime != null)
            updateAnimation(Math.min(100, time - lastTime) / 1000);
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    function updateAnimation(step) {
        cx.save();
        cx.clearRect(boxPos.x, boxPos.y, 300, 300);
        cx.beginPath();
        cx.rect(boxPos.x, boxPos.y, 300, 300);
        cx.stroke();
        cx.closePath();
        ball.move();
        ball.draw();
    }
    function move(from) {
        var x = Math.round(Math.random());
        var y = Math.round(Math.random());
        return from.plus(new Vector(x, y));
    }
}
///<reference path="../Objects/Objects.ts"/>
///<reference path="./bouncingBall.ts"/>
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
var startpos = new Vector(200, 200);
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
    cx.translate(x, y);
    cx.rotate((Math.PI / 180) * 45);
    cx.fillStyle = "red";
    cx.fillRect(0, 0, width, height);
    cx.restore();
}
function zigZag(lines, start, width, height) {
    var stepHeight = height / lines;
    var x = start.x, y = start.y;
    function isEven(n) {
        return !(n % 2);
    }
    cx.beginPath();
    cx.moveTo(x, y);
    //Move right, then move left 
    for (var i = 0; i < lines; i++) {
        x = isEven(i) ? start.x : x += width; // X is either on left or right 
        cx.lineTo(x, y);
        y += stepHeight;
    }
    cx.stroke();
    cx.closePath();
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
function spiral(a, b, center) {
    var bound = (2 * Math.PI);
    var step = bound / 100;
    var angle = 0;
    var y;
    var x;
    var cnt = 0;
    cx.beginPath();
    cx.moveTo(center.x, center.y);
    for (var i = 0; i < bound; i += step) {
        angle = 5 * i;
        x = center.x + (a + b * angle) * Math.cos(angle);
        y = center.x + (a + b * angle) * Math.sin(angle);
        cx.lineTo(x, y);
        cnt++;
    }
    cx.stroke();
    cx.closePath();
    console.log(cnt);
}
function star(radius, center, points) {
    var radius = 40;
    var sliceangle = (2 * Math.PI) / points;
    var angle = sliceangle;
    cx.beginPath();
    cx.moveTo(x + radius, y);
    for (var i = 1; i <= points; i++) {
        var angle = sliceangle * i;
        var x = center.x + (radius * Math.cos(angle));
        var y = center.y + (radius * Math.sin(angle));
        cx.quadraticCurveTo(center.x, center.y, x, y);
    }
    cx.stroke();
    cx.fillStyle = "yellow";
    cx.fill();
}
function pieChart(center, radius) {
    var total = results.reduce(function (sum, choice) { return sum + choice.count; }, 0);
    var currentAngle = -0.5 * Math.PI;
    results.forEach(function (result) {
        var sliceAngle = (result.count / total) * 2 * Math.PI;
        var label = result.name + ':' + result.count;
        var textAngle = currentAngle + (sliceAngle / 2);
        var textx = center.x + (radius + 10) * Math.cos(textAngle);
        var texty = center.y + (radius + 10) * Math.sin(textAngle);
        cx.beginPath();
        cx.arc(center.x, center.y, radius, currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(center.x, center.y);
        cx.textAlign = textAngle > 1.8 ? "right" : "left";
        cx.fillStyle = result.color;
        cx.fillText(label, textx, texty);
        cx.fill();
    });
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
bouncingBall(cx);
