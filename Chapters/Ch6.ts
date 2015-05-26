
class Vector{
	x: number;
	y: number; 
	
	constructor(x: number,y:number) {
	this.x = x;
	this.y = y;
	}
	
	plus(v: Vector):Vector {
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	
	minus(v: Vector):Vector {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	
	get length():number {
		return Math.sqrt( (Math.pow(this.x,2) + Math.pow(this.y,2)) );
	}
}

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
console.log(new Vector(3, 4).length);
console.log("test");

// IMPLEMENT A STRECHCELL INTERFACE

function repeat(str: string, times: number):string {
  var result = "";
  for (var i = 0; i < times; i++) {
    result += str;
  }
  return result;
}

class TextCell {
	
	text: Array<string>;
	
	constructor(text: string) {
		this.text = text.split("\n");
	}
	
	minWidth(): number{
  		return this.text.reduce(function(width: number, line: string) {
    		return Math.max(width, line.length);
		}, 0);
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
	private inner: TextCell;
	private width: number;
	private height: number;
	
	constructor(inner: TextCell, width: number, height: number){
		this.inner = inner;
		this.width = width;
		this.height = height;
	}
	
	minWidth(){
		return Math.max(this.inner.minWidth(), this.width);
	}
	
	minHeight() {
		return Math.max(this.inner.minHeight(), this.height);
	}
	
	draw(wid: number, hei: number) {
		var w: number = Math.max(this.minWidth(),wid);
		var h: number = Math.max(this.minHeight(),hei);
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

class ArraySeq{
	private array: Array<any>;
	private index: number;
	private end: boolean;
	
	constructor(array: Array<any>){
		this.array = array;
		this.index = 0;
		this.end = false; 
	}
	
	Next(): any {
		// is the current iterator at the end? 
		if(this.index == this.array.length) {
			this.end = true; 
		}
				
		if(!this.end) {
			var v: any = this.array[this.index];
			this.index += 1;
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

class RangeSeq{
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
	
	Next(): number {
		
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

function logFive(seq: any) {
	for (var i =0; i<5; i++) {
		if (!seq.atEnd) {
			console.log(seq.Next());
		}
	}
}

console.log("Array Testing");
logFive(new ArraySeq([1, 2]));
logFive(new RangeSeq(100, 1000));
console.log("ok");
