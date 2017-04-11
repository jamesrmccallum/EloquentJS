
import {Player, Coin, Lava} from './Actors'
import {Level} from './Level'
import {DOMDisplay} from './DOMDisplay';

var simpleLevelPlan: Array<string> = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

export interface ActorList{[key: string]: any};

export var actorChars: ActorList = {
  "@": Player,
  "o": Coin,
  "=": Lava, 
  "|": Lava, 
  "v": Lava
};


// CONFIGURATION 
let simpleLevel = new Level(simpleLevelPlan);

export var gameConfig = {
  scale: 20,
  maxStep: 0.05,
  wobbleSpeed: 8,
  wobbleDist: 8,
  lives: 3,
  playerXSpeed: 7,
  gravity: 30,
  jumpSpeed: 17 
}

export type IArrowCodes = {[id: number]: string}; 

var arrowCodes: IArrowCodes = {37: "left", 38: "up", 39: "right",27: "esc"};

export interface IKeysPressed {[id: string]: boolean}; 

function trackKeys(codes: IArrowCodes): IKeysPressed {
  let pressed:IKeysPressed = {};
  
  let handler = (e: KeyboardEvent)=> {
    if (codes[e.keyCode]) {
      let down = e.type == "keydown";
      pressed[codes[e.keyCode]] = down;
      e.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc: Function) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows: IKeysPressed = trackKeys(arrowCodes);
var pause: boolean = false;

function runLevel(level: Level, andThen: Function) {
  let display = new DOMDisplay(<HTMLDivElement>document.body, level);
  runAnimation((step: number)=> {
    if (arrows["esc"]) {pause = !pause}
      if(!pause) {
      level.animate(step, arrows);
      display.drawFrame(step);
      if (level.isFinished()) {
        display.clear();
        if (andThen) { andThen(level.status); }
        return false;
      }
    }
  });
}

function runGame(plans: Array<Array<string>>) {
  
  let cfg = gameConfig;
  let startLevel = (n: number) =>{

    runLevel(new Level(plans[n]), (status: string)=> {

      if (cfg.lives > 0) {
        if (status == "lost") {
          cfg.lives -= 1;
          startLevel(n);
        }
        else if (n < plans.length - 1 && cfg.lives > 0)
          startLevel(n + 1);
        else
          console.log("You win!");
      } else {
        startLevel(0);
      }
    });
  }

  startLevel(0);
}
