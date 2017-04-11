import {IActor} from './Actors';
import {Vector} from '../../Objects/Objects';
import {gameConfig, actorChars} from './Game'

let cfg = gameConfig;

export class Level {
  public width: number;
  public height: number;
  public grid: string[][];
  public actors: IActor[];
  public status: string;
  public player: IActor;
  private finishDelay: number;
  
  constructor(plan: string[]) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    
    for (let y = 0; y < this.height; y++) {
      let line = plan[y] 
      let gridLine: string[] = [];
      for (let x = 0; x < this.width; x++) {
        let ch = line[x], fieldType = null;
        let Actor = actorChars[ch];
        if (Actor)
          this.actors.push(new Actor(new Vector(x, y), ch));
        else if (ch == "x")
          fieldType = "wall";
        else if (ch == "!")
          fieldType = "lava";
        gridLine.push(fieldType);
      }
    this.grid.push(gridLine);
  }
    this.player = this.actors.filter(a=> {
      return a.type == "player";
    })[0];
    this.status = this.finishDelay = null;
  }
  
  isFinished(): boolean {
    return this.status != null && this.finishDelay < 0;
  }
  
  obstacleAt (pos: Vector, size: Vector): string {
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);
  
    if (xStart < 0 || xEnd > this.width || yStart < 0)
      return "wall";
    if (yEnd > this.height)
      return "lava";
    for (var y = yStart; y < yEnd; y++) {
      for (var x = xStart; x < xEnd; x++) {
        var fieldType = this.grid[y][x];
        if (fieldType) return fieldType;
      }
    }
  }
  
  actorAt(actor: IActor) {
    for (var i = 0; i < this.actors.length; i++) {
      var other = this.actors[i];
      if (other != actor &&
          actor.pos.x + actor.size.x > other.pos.x &&
          actor.pos.x < other.pos.x + other.size.x &&
          actor.pos.y + actor.size.y > other.pos.y &&
          actor.pos.y < other.pos.y + other.size.y)
        return other;
    }
  }
  
  playerTouched(type: string, actor?: IActor) {
    if (type == "lava" && this.status == null) {
      this.status = "lost";
      this.finishDelay = 1;
    } else if (type == "coin") {
      this.actors = this.actors.filter((o)=> {
        return o != actor;
      });
    if (!this.actors.some(a=> {
        return a.type == "coin";
    })) {
        this.status = "won";
        this.finishDelay = 1;
      }
    }
  }
  
  animate(step: number, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, cfg.maxStep);
    this.actors.forEach(a=> {
      a.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};
  
}


