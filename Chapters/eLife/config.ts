
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
module utilities {
  export function randomElement(array:Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  export function charFromElement(element) {
    if (element == null)
      return " ";
    else
      return element.originChar;
  }
  
  export function dirPlus(dir: string, n: number) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
  }
}
                  
var directions: Object = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

var directionNames: Array<string> = "n ne e se s sw w nw".split(" ");