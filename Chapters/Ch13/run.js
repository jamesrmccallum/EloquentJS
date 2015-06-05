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
    return Vector;
})();
///<reference path="../Objects/Objects.ts"/>
;
var MOUNTAINS = [
    { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
    { name: "Everest", height: 8848, country: "Nepal" },
    { name: "Mount Fuji", height: 3776, country: "Japan" },
    { name: "Mont Blanc", height: 4808, country: "Italy/France" },
    { name: "Vaalserberg", height: 323, country: "Netherlands" },
    { name: "Denali", height: 6168, country: "United States" },
    { name: "Popocatepetl", height: 5465, country: "Mexico" }
];
function buildTable(data) {
    var tbl = document.createElement("table");
    var headers = Object.keys(data[0]);
    var th = document.createElement("tr");
    headers.map(function (colname) {
        var p = document.createElement("th");
        p.innerHTML = colname;
        th.appendChild(p);
    });
    tbl.appendChild(th);
    data.map(function (mtn) {
        var r = document.createElement("tr");
        headers.map(function (key) {
            var p = document.createElement("td");
            p.innerHTML = mtn[key];
            r.appendChild(p);
            if (typeof mtn[key] == "number") {
                p.style.textAlign = "right";
            }
            ;
        });
        tbl.appendChild(r);
    });
    return tbl;
}
document.body.appendChild(buildTable(MOUNTAINS));
function byTagName(node, tagName) {
    var r = node.getElementsByTagName(tagName);
    var ret = [];
    for (var i = 0; i < r.length; i++) {
        ret.push(r[i]);
    }
    return ret;
}
function moveCat() {
    var cat = document.getElementById("CAT");
    var hat = document.getElementById("HAT");
    var angle = 0;
    var lastTime = null;
    var catTop, catLeft, hatTop, hatLeft;
    function animate(time) {
        if (lastTime != null) {
            angle += (time - lastTime) * 0.001;
        }
        ;
        lastTime = time;
        //Cat 
        catTop = (Math.sin(angle) * 20);
        catLeft = (Math.sin(angle) * 200);
        cat.style.top = catTop + "px";
        cat.style.left = catLeft + "px";
        //Hat 
        hatTop = (Math.asin(angle) * 5);
        hatLeft = (Math.asin(angle) * 50);
        hat.style.top = hatTop + "px";
        hat.style.left = hatLeft + "px";
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
// Mouse Trails 
var trails = [];
var colors = ["#00cbd0", "#0082c1", "#0900ff", "#7c00ff", "#e300ff"];
var prevpos = new Vector(0, 0);
function drawCircles(pos) {
    var x = pos.x;
    var y = pos.y;
    for (var i = 0; i < colors.length; i++) {
        var s = document.createElement("div");
        s.setAttribute("style", "height:10px; padding: 0; margin: 0;");
        s.style.width = "10px";
        s.style.borderRadius = "5px";
        s.style.top = x.toString() + "px";
        s.style.left = y.toString() + "px";
        s.className = "circle";
        s.style.backgroundColor = colors[i];
        document.body.appendChild(s);
        trails.push(s);
        x += 5;
        y += 5;
    }
}
;
function mouseTrails(evt) {
    var newpos = new Vector(evt.screenX, evt.screenY);
    var xdiff = newpos.x - prevpos.x;
    var ydiff = newpos.y - prevpos.y;
    var time = new Date().getTime();
    if (!trails.length) {
        drawCircles(newpos);
    }
    function moveTrails(time) {
        trails.forEach(function (a) {
            a.style.top = (parseInt(a.style.top) + xdiff) + "px";
            a.style.left = (parseInt(a.style.left) + ydiff) + "px";
        });
    }
    requestAnimationFrame(moveTrails);
    prevpos = newpos;
}
// MAIN 
document.addEventListener("DOMContentLoaded", function (event) {
    document.addEventListener("mousemove", function (evt) {
        mouseTrails(evt);
    });
    //moveCat()
});
