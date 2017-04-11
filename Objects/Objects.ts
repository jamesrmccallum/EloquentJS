
export interface IVector {
  x: number,
  y: number,
  move(v:Vector):Vector,
  plus(v:Vector):Vector,
  times(n:number):Vector
}

export class Vector {

  constructor(public x: number, public y: number) {
    this.x = x;
    this.y = y;
  }

  move(v: Vector) {
    let x: number = this.x + v.x
    let y: number = this.y + v.y
    return new Vector(x, y);
  }
  /**Return a new Vector which represents the old plus the new */
  plus(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  
  times(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }
}
