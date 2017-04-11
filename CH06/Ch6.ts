

// IMPLEMENT A STRETCHCELL INTERFACE

function repeat(str: string, times: number):string {
  var result = "";
  for (var i = 0; i < times; i++) {
    result += str;
  }
  return result;
}

class TextCell {
	
	private text: string[];
	
	constructor(text: string) {
		this.text = text.split("\n");
	}
	
	minWidth(): number{
  		return this.text.reduce((width: number, line: string) => Math.max(width, line.length), 0);
	}
	
	minHeight(): number {
		return this.text.length;
	}
	
	draw(width: number, height: number) {
	  var result: Array<string> = [];
	  
	  for (var i = 0; i < height; i++) {
	    var line = this.text[i] || "";
	    result.push(line + repeat(" ", width - line.length));
	  }
      return result;
	}
}

class StretchCell {
	
	constructor(private inner: TextCell, private width: number, private height: number){
	}
	
	minWidth(){
		return Math.max(this.inner.minWidth(), this.width);
	}
	
	minHeight() {
		return Math.max(this.inner.minHeight(), this.height);
	}
	
	draw(wid: number, hei: number) {
		let w: number = Math.max(this.minWidth(),wid);
		let h: number = Math.max(this.minHeight(),hei);
		return this.inner.draw(w,h);
	}
	
}

var sc = new StretchCell(new TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
console.log(sc.draw(3, 2));
console.log("test");

// SEQUENCE INTERFACE 

interface sequence {next():any, atEnd:boolean, currIndex: number}

class ArraySeq implements sequence{
	
	constructor(private array: any[], private index = 0, private end = false ){
	}
	
	next(): any {
		// is the current iterator at the end? 
		this.end = this.index == this.array.length;
				
		if(!this.end) {
			var v: any = this.array[this.index];
			this.index ++;
			return v;
		}
	}
	
	get atEnd(): boolean {
		return this.end;
	}
	
	get currIndex(): number {
		return this.index;
	}
}

class RangeSeq implements sequence{
	private first: number;
	private last: number;
	private index: number; 
	private end: boolean; 
	private val: number;
	
	constructor(start:number, end: number) {
		this.first = start;
		this.last = end;
		this.index = 0; 
		this.end = false; 
		this.val = start;
	}
	
	next(): number {	
		if (this.val <= this.last) {
			var v: number = this.val;
			this.val += 1;
			return v;
		} else {
			this.end = true; 
		}		  
	}
	
	get currIndex(): number {
		return this.val; 
	}
	
	get atEnd(): boolean {
		return this.end 
	}

}

function logFive(seq: sequence) {
	for (let i =0; i<5; i++) {
		if (!seq.atEnd) {
			console.log(seq.next());
		}
	}
}

console.log("Array Testing");
logFive(new ArraySeq([1, 2]));
logFive(new RangeSeq(100, 1000));
console.log("ok");
