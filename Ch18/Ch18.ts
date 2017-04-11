import {Vector} from '../Objects/Objects'

export function runCode(evt: MouseEvent) {
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
export function autoComplete(evt: Event, text: HTMLInputElement, completions: HTMLDivElement): void {

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

var directions = {
	"n": new Vector(0, -1),
	"ne": new Vector(1, -1),
	"e": new Vector(1, 0),
	"se": new Vector(1, 1),
	"s": new Vector(0, 1),
	"sw": new Vector(-1, 1),
	"w": new Vector(-1, 0),
	"nw": new Vector(-1, -1)
};

export class gameOfLife {

	public grid: Array<HTMLInputElement>;
	private container: HTMLDivElement;
	private width: number;

	constructor(container: HTMLDivElement, width: number) {
		this.container = container;
		this.grid = [];
		this.width = width;

		for (var i = 0; i < (width * width); i++) {
			var c = document.createElement("input");
			c.type = "checkbox";
			c.checked = Math.random() >= 0.5 ? true : false;
			this.grid.push(c);
		}
	}
	/**draws the contents of the grid to the container */
	draw() {
		//Clear
		while(this.container.firstChild) {
			this.container.removeChild(this.container.firstChild)
		}
		//Draw
		this.grid.forEach(c =>
			this.container.appendChild(c)
			)
	}

	private get(vec: Vector) {
		return this.grid[vec.x + this.width * vec.y];
	};
	
	private isInside(vec: Vector) {
		return vec.x >= 0 && vec.x < this.width &&
			vec.y >= 0 && vec.y < this.width;
	};
	
	/** Any live cell with fewer than two or more than three live neighbors dies.
	Any live cell with two or three live neighbors lives on to the next generation.
	Any dead cell with exactly three live neighbors becomes a live cell.*/
	private checksquare(sqr: Vector): boolean {
		var live: boolean = this.get(sqr).checked;
		console.log(sqr.x + ' ' +sqr.y + ' ' + live);
		var checked: Array<boolean> = [];
		var res: boolean = true;

		for (var dir in directions) {
			var targ: Vector = sqr.plus(directions[dir]);
			if (this.isInside(targ) && this.get(targ).checked) {
				checked.push(true);
			}
		}

		if (live) {
			if (checked.length < 2 || checked.length > 3) {res = false;}
		} else {
			if (checked.length != 3) {res = false;}
		}
		
		return res; 
	}
		
	/** advances the game one 'turn' - recalculates state */
	turn() {
		var tempgrid: Array<HTMLInputElement> = [];

		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.width; j++) {
				var sqr: Vector = new Vector(j, i)
				var t: HTMLInputElement = document.createElement('input');
				t.type = 'checkbox';
				t.checked = this.checksquare(sqr);
				tempgrid.push(t);
			}
		}
		this.grid = tempgrid;
		this.draw();
	}
}
