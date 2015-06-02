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

function mousetrails(): void {
  var trails: Array<SVGCircleElement> 
  
  for(var i = 0; i<10; i++) {
    var s = new SVGCircleElement;
    s.
  }
}

document.addEventListener("DOMContentLoaded", function(event: Event): void { 
  
  console.log(byTagName(document.body, "h1").length);
  // → 1
  console.log(byTagName(document.body, "span").length);
  // → 3
  var para = document.querySelector("p");
  console.log(byTagName(para, "span").length);
  
  var field: Element = document.querySelector("input");
  field.addEventListener("keydown", function(event: KeyboardEvent) {
    if (event.keyCode == 81 || event.keyCode == 87 || event.keyCode == 88) {
      event.preventDefault();
    }
  });
  
  //moveCat();
  
});


