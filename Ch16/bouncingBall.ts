import {Vector} from '../Objects/Objects';

class Ball {
  private _pos: Vector;
  private xbound: number;
  private ybound: number;
  private context: CanvasRenderingContext2D;
  private radius: number;
  private containerpos: Vector;
  private bearing: Vector; 
  
  constructor(pos: Vector, context: CanvasRenderingContext2D, radius: number,containerpos: Vector, containerWidth: number, containerHeight: number ) {
    this._pos = pos;
    this.containerpos = containerpos;
    this.xbound = containerpos.x + containerWidth - radius;
    this.ybound = containerpos.y + containerHeight - radius;
    this.context = context;
    this.radius = radius;
    this.bearing = new Vector(1,1); 
  }

  get pos() {
    return this._pos;
  }

  set pos(pos: Vector) {
    this._pos = pos;
  }

  move() {
    var target = this.pos.plus(this.bearing); 
    
    // hits y wall or x wall?
    if(target.x >= this.xbound || target.x <= (this.containerpos.x+this.radius) || target.y >= this.ybound || target.y <= (this.containerpos.y + this.radius)) {
      this.bounce(target);
    } else
    {
      this.pos = target;
    }

  }
  
  bounce(impact: Vector) {
   
   console.log(impact);
   var thisang = Math.atan2(impact.x,impact.y); 
   var newang = randomInRange(0,(2*Math.PI));
   this.bearing = new Vector(Math.cos(newang),Math.sin(newang));
   this.move; 
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

function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function bouncingBall(cx: CanvasRenderingContext2D) {
  var boxPos = new Vector(10, 10);
  var boxWidth = 300;
  var boxHeight = 300; 
  var ballPos = new Vector(80, 80);
  var lastTime: number = null;
  var ball = new Ball(ballPos,cx,20,boxPos,boxWidth,boxHeight)
  
  function frame(time) {
    if (lastTime != null)
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    lastTime = time;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  
  //Draw a rectangle   
    
  function updateAnimation(step) {
    
    cx.save();
    cx.clearRect(boxPos.x, boxPos.y, boxWidth, boxHeight);
    cx.beginPath();
    cx.rect(boxPos.x, boxPos.y, boxWidth, boxHeight);
    cx.stroke();
    cx.closePath();
    ball.move();     
    ball.draw();
  }
   
}