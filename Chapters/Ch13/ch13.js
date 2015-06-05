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
for (var i = 0; i < colors.length; i++) {
    var c = new trailCircle(colors[i], 10, new Vector(10, 10));
    trails.push(c);
    document.body.appendChild(c.draw());
}
var trailCircle = (function () {
    function trailCircle(color, radius, pos) {
        this.posn.x = pos.x;
        this.posn.y = pos.y;
        this.color = color;
        this.radius = radius;
    }
    trailCircle.prototype.draw = function () {
        var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("cx", this.posn.x.toString());
        s.setAttribute("cy", this.posn.y.toString());
        s.setAttribute("r", this.radius.toString());
        s.setAttribute("style", "color:" + this.color + ";");
        return s;
    };
    Object.defineProperty(trailCircle.prototype, "pos", {
        get: function () {
            return this.posn;
        },
        set: function (p) {
            this.pos = p;
        },
        enumerable: true,
        configurable: true
    });
    return trailCircle;
})();
var prevpos = new Vector(0, 0);
function mouseTrails(evt) {
    var newpos = new Vector(evt.screenX, evt.screenY);
    //If x is bigger we've moved right 
    //If y is bigger we've moved up 
    prevpos = newpos;
}
// MAIN 
document.addEventListener("DOMContentLoaded", function (event) {
    console.log(byTagName(document.body, "h1").length);
    // → 1
    console.log(byTagName(document.body, "span").length);
    // → 3
    var para = document.querySelector("p");
    console.log(byTagName(para, "span").length);
    var field = document.querySelector("input");
    field.addEventListener("keydown", function (event) {
        if (event.keyCode == 81 || event.keyCode == 87 || event.keyCode == 88) {
            event.preventDefault();
        }
    });
    window.addEventListener("mousemove", mouseTrails);
    //moveCat();
});