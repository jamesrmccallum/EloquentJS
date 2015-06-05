///<reference path="../Objects/Objects.ts"/>
interface Mountain {
	name: string;
	height: number;
	country: string;
};

 var MOUNTAINS: Array<Mountain> = [
  {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
  {name: "Everest", height: 8848, country: "Nepal"},
  {name: "Mount Fuji", height: 3776, country: "Japan"},
  {name: "Mont Blanc", height: 4808, country: "Italy/France"},
  {name: "Vaalserberg", height: 323, country: "Netherlands"},
  {name: "Denali", height: 6168, country: "United States"},
  {name: "Popocatepetl", height: 5465, country: "Mexico"}
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


function byTagName(node: Element, tagName: string): Array<Node> {
    var r: NodeList = node.getElementsByTagName(tagName);
	var ret: Array<Node> = [];
	for (var i =0; i < r.length; i++ ) {
		ret.push(r[i]);
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
    
    if (lastTime != null)  { 
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

var trails: Array<HTMLElement> = [];
var colors: Array<string> = ["#00cbd0","#0082c1","#0900ff","#7c00ff","#e300ff"];
var prevpos = new Vector(0,0);

function drawCircles(pos: Vector) {
  var x: number = pos.x;
  var y: number = pos.y;
  for (var i = 0; i < colors.length; i++) {
    var s: HTMLElement = document.createElement("div");
    s.setAttribute("style","height:10px; padding: 0; margin: 0;");
    s.style.width = "10px";
    s.style.borderRadius = "5px";
    s.style.top = x.toString() + "px";
    s.style.left = y.toString() + "px";
    s.className = "circle";  
    s.style.backgroundColor = colors[i];
    document.body.appendChild(s)
    trails.push(s);
    x+=5;
    y+=5;
  }
};

function mouseTrails(evt: MouseEvent) {
  
  var newpos = new Vector (evt.screenX, evt.screenY);
  var xdiff: number = newpos.x - prevpos.x  
  var ydiff: number = newpos.y - prevpos.y; 
  var time: number = new Date().getTime(); 
  
  if(!trails.length) {drawCircles(newpos);}
  
  function moveTrails(time: number): void {
    trails.forEach(function(a) {
      a.style.top = (parseInt(a.style.top) + xdiff) + "px";
      a.style.left = (parseInt(a.style.left) + ydiff) + "px";
    })
  }
   
  requestAnimationFrame(moveTrails);
  prevpos = newpos; 
 
}

// MAIN 
document.addEventListener("DOMContentLoaded", function(event: Event): void { 
 
  document.addEventListener("mousemove", function(evt: MouseEvent){
    mouseTrails(evt);
  });
  //moveCat()
});


