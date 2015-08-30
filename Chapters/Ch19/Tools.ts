///<reference path="./All.d.ts"/>

module Tools {

  interface ITool { [name: string]: Function };

  export var Tools: ITool = {

    line: (event: MouseEvent, cx: CanvasRenderingContext2D, onEnd?: EventListener) => {

      cx.lineCap = "round";
      var pos = Functions.relativePos(event, cx.canvas);

      var draw = (event: MouseEvent) => {
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
        pos = Functions.relativePos(event, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
      }

      Functions.trackDrag(draw, onEnd);
    },

    text: (event, cx: CanvasRenderingContext2D) => {
      var text: string = prompt("Text:", "");

      if (text) {
        var pos = Functions.relativePos(event, cx.canvas);
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
      var currentPos = Functions.relativePos(event, cx.canvas);

      var spray = setInterval(() => {
        for (var i = 0; i < dotsPerTick; i++) {
          var offset = Functions.randomPointInRadius(radius);
          cx.fillRect(currentPos.x + offset.x,
            currentPos.y + offset.y, 1, 1);
        }
      }, 25);

      Functions.trackDrag((event: MouseEvent) => {
        currentPos = Functions.relativePos(event, cx.canvas);
      }, () => {
        clearInterval(spray);
      });
    },

    rectangle: (event: MouseEvent, cx: CanvasRenderingContext2D) => {

      cx.lineCap = "round";
      //Get the start
      var pos = Functions.relativePos(event, cx.canvas);
      var size = new Objects.Vector(0, 0);
      var temprect = Functions.elt('Div', { class: 'tempRect' });
      document.body.appendChild(temprect);

      var getRect = (event: MouseEvent) => {

        var newpos = Functions.relativePos(event, cx.canvas);

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

      Functions.trackDrag(getRect, drawRect);

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
      var dirs = {"left": new Objects.Vector(-1,0),
                  "right": new Objects.Vector(1,0),
                  "up": new Objects.Vector(0,1),
                  "down": new Objects.Vector(0,1)
      };
                       
      var pos = Functions.relativePos(event,cx.canvas);
      var grid = cx.getImageData(0, 0, cx.canvas.width, cx.canvas.height).data;
      var targetColour = pixelColour(pos);
      var checked = new Array(grid.length/4);
      var maybes: Array<Objects.Vector> = [];
      
      //Converts a vector 
      function getAddress(pos: Objects.Vector) {
        return (pos.x + pos.y * cx.canvas.width)*4;
      }
      
      //Returns a length 4 Uint8ClampedArray (RGBA) for a given vector
      function pixelColour(pos: Objects.Vector): Uint8ClampedArray {
        var t = getAddress(pos);
        return grid.subarray(t,t+4);
      }
      
      // Look up down left right, record what was seen
      function scanSurrounding(pos: Objects.Vector) {
        for (var d in dirs) {
          var chkVector = pos.plus(dirs[d]);
          
          if(compareColour(targetColour,pixelColour(chkVector))) {
            
            maybes.push(chkVector);    
            
            cx.fillRect(chkVector.x,chkVector.y,1,1);
            
            checked[pos.x*pos.y] =1;
          }
          
        }  
      }
      
     //Compares two pixelColours
     function compareColour(px1: Uint8ClampedArray, px2: Uint8ClampedArray): boolean {
       for (var i =0; i<px1.length;i++) {
         if(px1[i] != px2[i]) 
          return false 
         }
       return true;
     }
     
     //Main loop   - L-R-U, L-R-D loop
     scanSurrounding(pos); 
     for (var i = 0; i< maybes.length; i++) {
       scanSurrounding(maybes[i])
     }
     
     //Move
     //Check + ?colour
     //Mark results
     
     
     
     
     
    //Create a new grid of 15,000 where xy represents the address - store 1's for checked addresses
    // Check will be if newGrid((x*y)==1)
      
     console.log(pixelColour(pos))

    }
  }
}