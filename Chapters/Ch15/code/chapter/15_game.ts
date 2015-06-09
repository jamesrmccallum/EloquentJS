///<reference path="../../../Objects/Objects.ts"/>
///<reference path="./Actors.ts"/>
///<reference path="./DomDisplay.ts"/>

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

interface ActorList{[key: string]: any};

var actorChars: ActorList = {
  "@": Player,
  "o": Coin,
  "=": Lava, 
  "|": Lava, 
  "v": Lava
};


// CONFIGURATION 
var simpleLevel = new Level(simpleLevelPlan);
var scale = 20;
var maxStep = 0.05;
var wobbleSpeed = 8, wobbleDist = 0.07;
var lives: number = 3; 

var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;

interface IArrowCodes {[id: number]: string}; 

var arrowCodes: IArrowCodes = {37: "left", 38: "up", 39: "right"};

interface IKeysPressed {[id: string]: boolean}; 

function trackKeys(codes: IArrowCodes): IKeysPressed {
  var pressed:IKeysPressed = {};
  
  function handler(event: KeyboardEvent) {
    if (codes[event.keyCode]) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
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

function runLevel(level: Level, andThen: Function) {
  var display = new DOMDisplay(document.body, level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

function runGame(plans: Array<Array<string>>) {

  function startLevel(n: number) {
    if (lives == 0) {
      startLevel(0)
    } else {
      runLevel(new Level(plans[n]), function(status) {
        if (status == "lost") {
          lives -= 1;
          startLevel(n);
        }
        else if (n < plans.length - 1 && lives > 0)
          startLevel(n + 1);
        else
          console.log("You win!");
      });
    }
  }
  startLevel(0);
}
