
//SUM OF A RANGE

function range(start: number, end: number, step?: number): number[] {
	var ret: number[] = [];

	var inc = step || 1;
	for (var i = start; i, i <= end; i + step) {
		ret.push(i);
	}
	return ret;
}

function sum(a: number[]) {
	return a.reduce((a, b) => { return a + b })
}

console.log(sum(range(1,10)));

console.log(range(5,2,-1));

//REVERSING AN ARRAY 

function reverseArray(a:any[]): any[]{
	var ret: any[] = [];
	for(var i = a.length; i = 0; i--) {
		ret.push(a[i]);
	}
	return ret;
}

function reverseArrayInPlace(a:any[]):any[] {
	
	var limit = Math.floor(a.length/2);
	
	for(var i = 0; i<limit; i++){
		var start: any = a[i];
		var end: any = a[a.length-i]; 
		a[i] = end;
		a[a.length-i] = start;
	}
	return a;
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]