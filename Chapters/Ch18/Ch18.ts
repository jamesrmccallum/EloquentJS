///<reference path="../Objects/Objects.ts"/>

function runCode(evt: MouseEvent) {
	var codepane: HTMLTextAreaElement = <HTMLTextAreaElement> document.querySelector('#code');
	var output: HTMLPreElement = <HTMLPreElement> document.querySelector('#output');
	var code = codepane.innerHTML;
	var fun: Function = new Function(code);
	try {
		var result = fun();
	} catch (err) {
		var result = err;
	}
	output.innerText = result;
}
/** takes an input element and an element for completions, reponds to input change **/
function autoComplete(evt: Event, text: HTMLInputElement, completions: HTMLDivElement): void {
	
	function clear() {
		while (completions.firstChild) {
	    	completions.removeChild(completions.firstChild);
		}
	}
	
	clear()
	
	if (!terms) {
		var terms: Array<string> = [];
		for (var name in window) {
			terms.push(<string>name);
		}
	}

	var search: string = text.value;

	var hits: Array<string> = terms.filter(function(t) {
		return t.indexOf(search) > -1;
	})

	for (var i = 0; i < hits.length; i++) {
		var d: HTMLDivElement = document.createElement("div");
		d.innerHTML = hits[i];
		d.addEventListener("click", function(evt) {
			var div = <HTMLDivElement>evt.currentTarget
			text.value = div.innerHTML;
			clear();
		});
		completions.appendChild(d);
	}
}

class gameOfLife {

	public grid: Array<HTMLInputElement>;
	private container: HTMLDivElement;

	constructor(container: HTMLDivElement) {
		this.container = container; 
		this.grid = [];
		
		for (var i = 0; i < 100; i++) {
			var c = document.createElement("input");
			c.type = "checkbox";
			c.checked = Math.random() >= 0.5 ? true : false;
			this.grid.push(c);
		}
	}
	/**draws the contents of the grid to the container */
	draw() {
		var t: HTMLTableElement = document.createElement('table');
		this.container.appendChild(t); 
		
		this.grid.forEach(c =>
			this.container.appendChild(c)
		)	 
	}
	/** advances the game one 'turn' - recalculates state */
	turn() {
		this.grid.forEach((c,i,a) => 
			c.checked = checksquare(c,i,a)
		)}
}
//Any live cell with fewer than two or more than three live neighbors dies.
//Any live cell with two or three live neighbors lives on to the next generation.
//Any dead cell with exactly three live neighbors becomes a live cell.
function checksquare(e: HTMLInputElement, i: number,a: Array<HTMLElement>): boolean {
	var c: boolean = e.checked;
	var checked: Array<boolean> = [];
	
	if (a[i-1]) {
		checked.push(true)
	}
	
	if(a[i+1]){
		checked.push(true)
	}
	
	if(a[i+9]){
		checked.push(true)
	}
	
	if(a[i-9]){
		checked.push(true)
	}
	
	if(a[i+11]){
		checked.push(true)
	}
	
	if(a[i-11]){
		checked.push(true)
	}
	
	return checked.length > 3
}