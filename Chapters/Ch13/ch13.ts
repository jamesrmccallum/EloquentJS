///<reference path="../Objects/Objects.ts"/>
interface Mountain {
  name: string;
  height: number;
  country: string;
};

var MOUNTAINS: Array<Mountain> = [
  { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
  { name: "Everest", height: 8848, country: "Nepal" },
  { name: "Mount Fuji", height: 3776, country: "Japan" },
  { name: "Mont Blanc", height: 4808, country: "Italy/France" },
  { name: "Vaalserberg", height: 323, country: "Netherlands" },
  { name: "Denali", height: 6168, country: "United States" },
  { name: "Popocatepetl", height: 5465, country: "Mexico" }
];


function buildTable(data: Array<Mountain>): HTMLTableElement {
  var tbl: HTMLTableElement = document.createElement("table");
  var headers: Array<any> = Object.keys(data[0]);
  var th: HTMLTableRowElement = document.createElement("tr");

  headers.map(function(colname: string) {
    var p: HTMLTableHeaderCellElement = document.createElement("th");
    p.innerHTML = colname;
    th.appendChild(p);
  });

  tbl.appendChild(th);

  data.map(function(mtn) {
    var r: HTMLTableRowElement = document.createElement("tr");
    headers.map(function(key) {
      var p: HTMLTableDataCellElement = document.createElement("td");
      p.innerHTML = mtn[key];
      r.appendChild(p);
      if (typeof mtn[key] == "number") { p.style.textAlign = "right" };
    })
    tbl.appendChild(r);
  })
  return tbl;
}

document.body.appendChild(buildTable(MOUNTAINS));


function byTagName(node: Element, tagName: string): Array<HTMLElement> {
  var r: NodeList = node.getElementsByTagName(tagName);
  var ret: Array<HTMLElement> = [];
  for (var i = 0; i < r.length; i++) {
    ret.push((<HTMLElement>r[i]));
  }
  return ret;
}

function moveCat() {
  var cat: HTMLElement = document.getElementById("CAT");
  var hat: HTMLElement = document.getElementById("HAT");
  var angle: number = 0;
  var lastTime: number = null;
  var catTop: number, catLeft: number, hatTop: number, hatLeft: number;

  function animate(time: number) {

    if (lastTime != null) {
      angle += (time - lastTime) * 0.001;
    };

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

interface Trail { el: HTMLElement, offset: { x: number, y: number } };
var trails: Array<Trail> = [];
var colors: Array<string> = ["#00cbd0", "#0082c1", "#0900ff", "#7c00ff", "#e300ff"];
var prevpos = new Vector(0, 0);

function mouseTrails(evt: MouseEvent) {

  var newpos = new Vector(evt.pageX, evt.pageY);
  var xdiff: number = prevpos.x - newpos.x;
  var ydiff: number = prevpos.y - newpos.y;
  var time: number = new Date().getTime();
  var xdir: string = xdiff > 0 ? 'LEFT' : 'RIGHT';
  var ydir: string = ydiff > 0 ? 'UP' : 'DOWN';

  console.log(xdir + " , " + ydir);

  if (!trails.length) { drawCircles(newpos); }

  function moveTrails(time: number): void {
    trails.forEach(function(a) {
      a.el.style.top = (newpos.y + a.offset.y) + "px";
      a.el.style.left = (newpos.x + a.offset.x) + "px";
    })
  }
  //console.log ("moved from" + prevpos.x +","+prevpos.y + " to " + newpos.x +","+newpos.y)
  //console.log(xdiff + " " + ydiff);
  requestAnimationFrame(moveTrails);
  prevpos = newpos;

  function drawCircles(pos: Vector) {
    for (var i = 0; i < colors.length; i++) {
      var s: HTMLElement = document.createElement("div");
      s.style.top = pos.x.toString() + "px";
      s.style.left = pos.y.toString() + "px";
      s.className = "circle";
      s.style.backgroundColor = colors[i];
      document.body.appendChild(s)
      var t: Trail = { el: s, offset: { x: pos.x, y: pos.y } }
      trails.push(t);
      pos.x -= 5;
      pos.y += 5;
    }
  };
}

/// TABBED DISPLAY 
function asTabs(el: HTMLElement) {
  var d: HTMLDivElement = document.createElement("div");
  var tabs: { [name: string]: HTMLElement; } = {};
  var activetab: string = "one";
  d.className = "tabs";
  for (var i = 0; i < el.children.length; i++) {
    var e: HTMLElement = <HTMLElement>el.children[i];
    var s: string = e.attributes.getNamedItem("data-tabname").value;
    var b: HTMLButtonElement = document.createElement("button");
    b.innerText = s;
    d.appendChild(b);
    tabs[s] = e;
    if (s != activetab) {
      e.style.display = "none";
    }
  }

  d.onclick = function(ev: MouseEvent) {
    var a = <HTMLElement>event.target;
    if (a.nodeName == "BUTTON" && a.innerText != activetab) {
      tabs[activetab].style.display = "none"
      activetab = a.innerText;
      tabs[activetab].style.display = "block";
    }
  }

  el.insertBefore(d, document.getElementById("wrapper").firstChild);


}
// MAIN 
document.addEventListener("DOMContentLoaded", function(event: Event): void {

  asTabs(<HTMLElement>document.querySelector("#wrapper"));
});


