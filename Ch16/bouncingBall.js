System.register(['../Objects/Objects'], function(exports_1) {
    "use strict";
    var Objects_1;
    var Ball;
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    function bouncingBall(cx) {
        var boxPos = new Objects_1.Vector(10, 10);
        var boxWidth = 300;
        var boxHeight = 300;
        var ballPos = new Objects_1.Vector(80, 80);
        var lastTime = null;
        var ball = new Ball(ballPos, cx, 20, boxPos, boxWidth, boxHeight);
        function frame(time) {
            if (lastTime != null)
                updateAnimation(Math.min(100, time - lastTime) / 1000);
            lastTime = time;
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        //Draw a rectangle   
        function updateAnimation(step) {
            cx.save();
            cx.clearRect(boxPos.x, boxPos.y, boxWidth, boxHeight);
            cx.beginPath();
            cx.rect(boxPos.x, boxPos.y, boxWidth, boxHeight);
            cx.stroke();
            cx.closePath();
            ball.move();
            ball.draw();
        }
    }
    exports_1("bouncingBall", bouncingBall);
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            }],
        execute: function() {
            class Ball {
                constructor(pos, context, radius, containerpos, containerWidth, containerHeight) {
                    this._pos = pos;
                    this.containerpos = containerpos;
                    this.xbound = containerpos.x + containerWidth - radius;
                    this.ybound = containerpos.y + containerHeight - radius;
                    this.context = context;
                    this.radius = radius;
                    this.bearing = new Objects_1.Vector(1, 1);
                }
                get pos() {
                    return this._pos;
                }
                set pos(pos) {
                    this._pos = pos;
                }
                move() {
                    var target = this.pos.plus(this.bearing);
                    // hits y wall or x wall?
                    if (target.x >= this.xbound || target.x <= (this.containerpos.x + this.radius) || target.y >= this.ybound || target.y <= (this.containerpos.y + this.radius)) {
                        this.bounce(target);
                    }
                    else {
                        this.pos = target;
                    }
                }
                bounce(impact) {
                    console.log(impact);
                    var thisang = Math.atan2(impact.x, impact.y);
                    var newang = randomInRange(0, (2 * Math.PI));
                    this.bearing = new Objects_1.Vector(Math.cos(newang), Math.sin(newang));
                    this.move;
                }
                draw() {
                    this.context.beginPath();
                    this.context.arc(this._pos.x, this._pos.y, this.radius, 0, 2 * Math.PI);
                    this.context.fillStyle = 'red';
                    this.context.fill();
                    this.context.stroke();
                    this.context.closePath();
                    this.context.restore();
                }
            }
        }
    }
});
