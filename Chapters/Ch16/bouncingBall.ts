///<reference path="../Objects/Objects.ts"/>

class Ball {
  private _pos: Vector;
  private xbound: number;
  private ybound: number;
  private context: CanvasRenderingContext2D;
  private radius: number;

  constructor(pos: Vector, context: CanvasRenderingContext2D, radius: number) {
    this._pos = pos;
    this.xbound = context.canvas.width;
    this.ybound = context.canvas.height;
    this.context = context;
    this.radius = radius;
  }

  get pos() {
    return this._pos;
  }

  set pos(pos: Vector) {
    this._pos = pos;
  }

  move() {
    this.pos.plus()

  }

  draw() {
    this.context.beginPath();
    this.context.arc(this._pos.x, this._pos.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }
}


function bouncingBall(cx: CanvasRenderingContext2D) {
  var boxPos = new Vector(10, 10);
  var ballPos = new Vector(80, 80);
  var lastTime: number = null;
  var ball = new Ball(ballPos,cx,20)
  
  function frame(time) {
    if (lastTime != null)
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    lastTime = time;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  function updateAnimation(step) {

    cx.save();
    cx.clearRect(boxPos.x, boxPos.y, 300, 300);
    cx.beginPath();
    cx.rect(boxPos.x, boxPos.y, 300, 300);
    cx.stroke();
    cx.closePath();
    
    ball.move();     
    ball.draw();
  }
  
  function move(from: Vector): Vector {
    var x = Math.round(Math.random());
    var y = Math.round(Math.random());
    return from.plus(new Vector(x,y));
  }
}