System.register(['../Objects/Objects'], function(exports_1) {
    "use strict";
    var Objects_1;
    var MOUNTAINS, trails, colors, prevpos;
    function buildTable(data) {
        var tbl = document.createElement("table");
        var headers = Object.keys(data[0]);
        var th = document.createElement("tr");
        headers.map((colname) => {
            var p = document.createElement("th");
            p.innerHTML = colname;
            th.appendChild(p);
        });
        tbl.appendChild(th);
        data.map((mtn) => {
            var r = document.createElement("tr");
            headers.map((key) => {
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
    function mouseTrails(evt) {
        var newpos = new Objects_1.Vector(evt.pageX, evt.pageY);
        var xdiff = prevpos.x - newpos.x;
        var ydiff = prevpos.y - newpos.y;
        var time = new Date().getTime();
        var xdir = xdiff > 0 ? 'LEFT' : 'RIGHT';
        var ydir = ydiff > 0 ? 'UP' : 'DOWN';
        console.log(xdir + " , " + ydir);
        if (!trails.length) {
            drawCircles(newpos);
        }
        function moveTrails(time) {
            trails.forEach(function (a) {
                a.el.style.top = (newpos.y + a.offset.y) + "px";
                a.el.style.left = (newpos.x + a.offset.x) + "px";
            });
        }
        //console.log ("moved from" + prevpos.x +","+prevpos.y + " to " + newpos.x +","+newpos.y)
        //console.log(xdiff + " " + ydiff);
        requestAnimationFrame(moveTrails);
        prevpos = newpos;
        function drawCircles(pos) {
            for (var i = 0; i < colors.length; i++) {
                let s = document.createElement("div");
                s.style.top = pos.x.toString() + "px";
                s.style.left = pos.y.toString() + "px";
                s.className = "circle";
                s.style.backgroundColor = colors[i];
                document.body.appendChild(s);
                let t = { el: s, offset: { x: pos.x, y: pos.y } };
                trails.push(t);
                pos.x -= 5;
                pos.y += 5;
            }
        }
        ;
    }
    /// TABBED DISPLAY 
    function asTabs(el) {
        var d = document.createElement("div");
        var tabs = {};
        var activetab = "one";
        d.className = "tabs";
        for (var i = 0; i < el.children.length; i++) {
            var e = el.children[i];
            var s = e.attributes.getNamedItem("data-tabname").value;
            var b = document.createElement("button");
            b.innerText = s;
            d.appendChild(b);
            tabs[s] = e;
            if (s != activetab) {
                e.style.display = "none";
            }
        }
        d.onclick = function (ev) {
            var a = event.target;
            if (a.nodeName == "BUTTON" && a.innerText != activetab) {
                tabs[activetab].style.display = "none";
                activetab = a.innerText;
                tabs[activetab].style.display = "block";
            }
        };
        el.insertBefore(d, document.getElementById("wrapper").firstChild);
    }
    function main() {
        document.addEventListener("DOMContentLoaded", function (event) {
            asTabs(document.querySelector("#wrapper"));
        });
    }
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            }],
        execute: function() {
            ;
            MOUNTAINS = [
                { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
                { name: "Everest", height: 8848, country: "Nepal" },
                { name: "Mount Fuji", height: 3776, country: "Japan" },
                { name: "Mont Blanc", height: 4808, country: "Italy/France" },
                { name: "Vaalserberg", height: 323, country: "Netherlands" },
                { name: "Denali", height: 6168, country: "United States" },
                { name: "Popocatepetl", height: 5465, country: "Mexico" }
            ];
            document.body.appendChild(buildTable(MOUNTAINS));
            ;
            trails = [];
            colors = ["#00cbd0", "#0082c1", "#0900ff", "#7c00ff", "#e300ff"];
            prevpos = new Objects_1.Vector(0, 0);
        }
    }
});
