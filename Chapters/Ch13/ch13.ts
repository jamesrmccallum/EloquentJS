 interface Mountain {
	 name: string;
	 height: number;
	 country: string;
 }
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
			if(typeof mtn[key] == "number") {p.style.textAlign = "right"}; 
		})
		tbl.appendChild(r);
	})	   
	return tbl;  
  }
  
  document.body.appendChild(buildTable(MOUNTAINS));