class Vector {
  public x: number; public y: number;
  
  constructor(x: number, y: number) {
	  this.x = x;
	  this.y = y;
  }
  plus(v: Vector) {
	  this.x += v.x
    this.y += v.y 
    return this;
  }
}

//Functions 

function randomElement(array:Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

function dirPlus(dir: string, n: number) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}
