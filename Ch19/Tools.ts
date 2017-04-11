
import {Vector} from '../Objects/Objects';
import {relativePos,trackDrag,elt,randomPointInRadius} from './Functions';

interface ITool { [name: string]: Function };

export var Tools: ITool = {

  line: (event: MouseEvent, cx: CanvasRenderingContext2D, onEnd?: EventListener) => {

    cx.lineCap = "round";
    var pos = relativePos(event, cx.canvas);

    var draw = (event: MouseEvent) => {
      cx.beginPath();
      cx.moveTo(pos.x, pos.y);
      pos = relativePos(event, cx.canvas);
      cx.lineTo(pos.x, pos.y);
      cx.stroke();
    }

    trackDrag(draw, onEnd);
  },

  text: (event, cx: CanvasRenderingContext2D) => {
    var text: string = prompt("Text:", "");

    if (text) {
      var pos = relativePos(event, cx.canvas);
      cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
      cx.fillText(text, pos.x, pos.y);
    }
  },

  erase: (event, cx: CanvasRenderingContext2D) => {
    cx.globalCompositeOperation = "destination-out";
    Tools["line"](event, cx, () => {
      cx.globalCompositeOperation = "source-over";
    });
  },

  spray: (event: MouseEvent, cx: CanvasRenderingContext2D) => {
    var radius: number = cx.lineWidth / 2;
    var area: number = radius * radius * Math.PI;
    var dotsPerTick: number = Math.ceil(area / 30);
    var currentPos = relativePos(event, cx.canvas);

    var spray = setInterval(() => {
      for (var i = 0; i < dotsPerTick; i++) {
        var offset = randomPointInRadius(radius);
        cx.fillRect(currentPos.x + offset.x,
          currentPos.y + offset.y, 1, 1);
      }
    }, 25);

    trackDrag((event: MouseEvent) => {
      currentPos = relativePos(event, cx.canvas);
    }, () => {
      clearInterval(spray);
    });
  },

  rectangle: (event: MouseEvent, cx: CanvasRenderingContext2D) => {

    cx.lineCap = "round";
    //Get the start
    var pos = relativePos(event, cx.canvas);
    var size = new Vector(0, 0);
    var temprect = elt('Div', { class: 'tempRect' });
    document.body.appendChild(temprect);

    var getRect = (event: MouseEvent) => {

      var newpos = relativePos(event, cx.canvas);

      size.y = newpos.y - pos.y;
      size.x = newpos.x - pos.x;

      temprect.style.left = pos.x + cx.canvas.parentElement.offsetLeft + "px";
      temprect.style.top = pos.y + cx.canvas.parentElement.offsetTop + "px";
      temprect.style.height = size.y + "px"
      temprect.style.width = size.x + "px"
    }

    var drawRect = () => {
      temprect.remove();
      cx.beginPath();
      cx.rect(pos.x, pos.y, size.x, size.y);
      cx.stroke();
    }

    trackDrag(getRect, drawRect);

  },

  colorPicker: (event: MouseEvent, cx: CanvasRenderingContext2D) => {

    try {
      var p = cx.getImageData(event.x, event.y, 1, 1).data;
      var rgb = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
      console.log('Hit the setColor function, ' + rgb)
      cx.fillStyle = rgb;
      cx.strokeStyle = rgb;
    } catch (ex) {
      if (ex.name == 'SecurityError') {
        alert("Can't use that here...")
      } else {
        throw new Error(ex);
      }
    }
  },
  
  
  floodFill: (event: MouseEvent, cx: CanvasRenderingContext2D) => {
    
    //Array of directions 
    var dirs = {"left": new Vector(-1,0),
                "right": new Vector(1,0),
                "up": new Vector(0,1),
                "down": new Vector(0,-1)
    };
                      
    var pos = relativePos(event,cx.canvas);
    var grid = cx.getImageData(0, 0, cx.canvas.width, cx.canvas.height).data;
    var targetColour = pixelColour(pos);
    var colored = [];
    var tocheck = [];
    
    //Converts a vector to an address on the imagedata.data
    function getAddress (pos: Vector) {
      return (pos.x + pos.y * cx.canvas.width)*4;
    }
    
    //Returns a length 4 Uint8ClampedArray (RGBA) for a given vector
    function pixelColour(pos: Vector): Uint8ClampedArray {
      var t = getAddress(pos);
      return grid.subarray(t,t+4);
    }
    
    // Look up down left right, record what was seen
    function fillscan(pos: Vector) {
      cx.fillRect(pos.x,pos.y,1,1);
      colored[pos.x*pos.y] = true;
      tocheck.shift();
      for (var d in dirs) {
        var chk = pos.plus(dirs[d]);
        if(!isChecked(chk)) { //If this hasn't already been checked
          if(isTarget(chk)) { tocheck.push(chk);} 
        }
      }  
    }
    
    /** Does the colour of a given cell match the one we're targeting?*/
    function isTarget(pos: Vector): boolean {
      return compareColour(targetColour,pixelColour(pos));
    }
    
    /**  Have we checked this one? */
    function isChecked(chk: Vector): boolean {
      return !colored[chk.x*chk.y]==undefined;
    }
    
    /**  Compares two pixelColours RGBA array */
    function compareColour(px1: Uint8ClampedArray, px2: Uint8ClampedArray): boolean {
      for (var i =0; i<px1.length;i++) {
        if(px1[i] != px2[i]) 
        return false 
        }
      return true;
    }
    
    //Main loop   - L-R-U, L-R-D loop
    tocheck.push(pos);
    while(tocheck) {
      fillscan(tocheck[0]);
    }
    
    console.log(pixelColour(pos))

  }
}
