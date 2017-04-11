System.register(['../Objects/Objects', './bouncingBall'], function(exports_1) {
    "use strict";
    var Objects_1, bouncingBall_1;
    var canvas, cx, counterDiv, results, startpos, throttled;
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
        var total = results.reduce((sum, choice) => sum + choice.count, 0);
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
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            },
            function (bouncingBall_1_1) {
                bouncingBall_1 = bouncingBall_1_1;
            }],
        execute: function() {
            canvas = document.querySelector("canvas");
            cx = canvas.getContext("2d");
            counterDiv = document.querySelector('#counter');
            ;
            results = [
                { name: "Satisfied", count: 1043, color: "lightblue" },
                { name: "Neutral", count: 563, color: "lightgreen" },
                { name: "Unsatisfied", count: 510, color: "pink" },
                { name: "No comment", count: 175, color: "silver" }
            ];
            startpos = new Objects_1.Vector(200, 200);
            throttled = false;
            document.addEventListener("mousemove", function (evt) {
                if (!throttled) {
                    throttled = true;
                    mouseTrack(evt);
                    setTimeout(function () { throttled = false; });
                }
            });
            bouncingBall_1.bouncingBall(cx);
        }
    }
});
