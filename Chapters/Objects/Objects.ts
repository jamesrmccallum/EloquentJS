class Vector {
  public x: number; public y: number;
  
  constructor(x: number, y: number) {
	  this.x = x;
	  this.y = y;
  }
  
  move(v: Vector) {
    var x: number = this.x + v.x
    var y: number = this.y + v.y 
    return new Vector(x,y);
  }
  
  plus(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  } 
  times(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }
}