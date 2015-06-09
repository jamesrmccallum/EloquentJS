///<reference path="../../../Objects/Objects.ts"/>
///<reference path="./15_game.ts"/>


class Level {
  public width: number;
  public height: number;
  public grid: Array<Array<string>>;
  public actors: Array<IActor>
  public status: string;
  public player: IActor;
  private finishDelay: number;
  
  constructor(plan: Array<string>) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    
    for (var y = 0; y < this.height; y++) {
      var line = plan[y] 
      var gridLine: Array<string> = [];
      for (var x = 0; x < this.width; x++) {
        var ch = line[x], fieldType = null;
        var Actor = actorChars[ch];
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
    this.player = this.actors.filter(function(actor: IActor) {
      return actor.type == "player";
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
      this.actors = this.actors.filter(function(other) {
        return other != actor;
      });
    if (!this.actors.some(function(actor) {
        return actor.type == "coin";
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
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};
  
}


