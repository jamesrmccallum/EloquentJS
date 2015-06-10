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

var startpos = new Vector(200,200)

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
  cx.translate(x,y);
  cx.rotate((Math.PI/180)*45);
  cx.fillStyle ="red"; 
  cx.fillRect(0,0,width,height);
  cx.restore();
}

function zigZag(lines: number, start: Vector, width:number, height: number) {
  var stepHeight: number = height/lines;
  var x = start.x,y=start.y 
  
  function isEven(n: number): boolean {
    return!(n % 2); 
  }
  
  cx.beginPath();
  cx.moveTo(x,y); 
  //Move right, then move left 
  for (var i= 0; i<lines; i++) {

      x = isEven(i)?start.x : x+=width;  // X is either on left or right 
      cx.lineTo(x,y);
      y+=stepHeight
  }  
  cx.stroke();
  cx.closePath();
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

function spiral(a: number, b: number, center: Vector) {
  
  var bound: number = (2* Math.PI);
  var step: number = bound / 100;
  var angle: number = 0; 
  var y: number; 
  var x: number;
  var cnt: number = 0;
  
  cx.beginPath()
  cx.moveTo(center.x, center.y)
  
  for (var i = 0; i < bound; i+=step) {
    angle = 5 * i 
    x = center.x + (a + b * angle) * Math.cos(angle)
    y = center.x + (a + b * angle) * Math.sin(angle)
    cx.lineTo(x, y);
    cnt ++; 
  }
  
  cx.stroke();
  cx.closePath();
  console.log(cnt)
}

function star(radius: number, center: Vector, points: number) {
  var radius: number = 40;
  var sliceangle = (2 * Math.PI) / points;
  var angle: number = sliceangle;
  cx.beginPath();
  cx.moveTo(x + radius, y);

  for (var i = 1; i <= points; i++) {
    var angle: number = sliceangle * i;
    var x: number = center.x + (radius * Math.cos(angle));
    var y: number = center.y + (radius * Math.sin(angle));
    cx.quadraticCurveTo(center.x, center.y, x, y)
  }
  cx.stroke()
  cx.fillStyle = "yellow";
  cx.fill();
}
  
function pieChart(center: Vector, radius: number) {
  var total: number = results.reduce((sum, choice) => sum + choice.count, 0);
  var currentAngle: number = -0.5 * Math.PI;

  results.forEach(function(result: IResult) {
    var sliceAngle = (result.count / total) * 2 * Math.PI;
    var label: string = result.name + ':' + result.count;
    var textAngle: number = currentAngle +(sliceAngle/2);
    var textx: number = center.x + (radius + 10) * Math.cos(textAngle);
    var texty: number = center.y + (radius + 10) * Math.sin(textAngle);
    console.log(textAngle +' '+label)
    cx.beginPath();
    cx.arc(center.x, center.y, radius, currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(center.x, center.y);
    cx.textAlign = textAngle > 1.8 ? "right" : "left";
    cx.fillStyle = result.color;
    cx.fillText(label, textx, texty);
    cx.fill();
  });
}

function run(): void {
  pieChart(startpos,90)
}

function mouseTrack(evt: MouseEvent) {
  var x: number = evt.x;
  var y: number = evt.y;

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