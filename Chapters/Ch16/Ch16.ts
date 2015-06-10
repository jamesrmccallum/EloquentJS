///<reference path="../Objects/Objects.ts"/>
var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("canvas");
var cx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
var counterDiv: HTMLDivElement = <HTMLDivElement>document.querySelector('#counter');

interface IResult {name: string,count: number, color: string};

var results: Array<IResult> = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];

var startpos = new Vector(100,100)

function flipHorizontally(context:CanvasRenderingContext2D, around: number) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

function trapezoid(height: number, bottomWidth: number, topwidth: number,start: Vector): void {
  var inset: number = (bottomWidth - topwidth) / 2
  var x = start.x, y=start.y 
  cx.beginPath();
  cx.moveTo(x,y);//Bottom left
  cx.lineTo(x+=inset,y-=height) //Top left 
  cx.lineTo(x+=topwidth,y) //Top right
  cx.lineTo(x+=inset,y+=height);
  cx.lineTo(start.x,start.y);
  cx.closePath; 
  cx.stroke();
}

function redDiamond(height: number, width: number, start: Vector) {
  var x = start.x, y=start.y; 
  cx.save()
  cx.rotate((Math.PI/180)*45);
  cx.fillStyle ="red"; 
  cx.fillRect(x,y,width,height);
  cx.restore();
}

function branch(length: number, angle: number, scale: number): void {
      cx.fillRect(0, 0, 1, length);
      if (length < 8) return;
      cx.save();
      cx.translate(0, length);
      cx.rotate(-angle);
      branch(length * scale, angle, scale);
      cx.rotate(2 * angle);
      branch(length * scale, angle, scale);
      cx.restore();
}
  
function run() {
  redDiamond(30,30,startpos)
}

function mouseTrack(evt: MouseEvent) {
  
  var x = evt.x;
  var y = evt.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  counterDiv.innerHTML = "X:" +x + " Y:"+y;
}

var throttled: boolean = false; 

document.addEventListener("mousemove",function(evt: MouseEvent){
  if(!throttled) {
    throttled = true; 
    mouseTrack(evt);
    setTimeout(function(){throttled=false});
  }
});

run()