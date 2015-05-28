///<reference path="environment.ts"/>
///<reference path="utilities.ts"/>

interface Creaturespec<T>{ energy: number; direction: string; act(): T; preyseen?: Array<any>; originChar: string};

//var Creaturespecs: {[id: string]: new Creaturespec<T> } = {}

class creature { 
  private __act: Function;
  public energy: number;
  public direction: string;
  public preyseen: Array<any>
  public originChar: string;
   
  constructor(public spec: Creaturespec<T>, originChar: string) {
    this.__act = spec.act; 
  }
  
  act(): T {
    return this.__act;
    }
};

function createCreature(legend:string, ch: string): creature {
  if (ch == " ")
    return null;
  var s: Creaturespec = Creaturespecs[ch];
  var c: creature = new creature(s,ch)
  return c;
}

Creaturespecs["Wall"] = {
  energy: null,
  direction: null,
  act: null  
};

Creaturespecs["PlantEater"] = {
  energy:20, 
  direction: "" , 
  act: function(view: View) {
    var space = view.find(" ");
    if (this.energy > 60 && space)
      return {type: "reproduce", direction: space};
    var plant = view.find("*");
    if (plant)
      return <Action>{type: "eat", direction: plant};
    if (space)
      return <Action>{type: "move", direction: space};
  }
};

Creaturespecs["WallFollower"] = {
    energy: 20 , 
    direction: "s" , 
    act: function(view: View):Action {
      var start = this.direction;
      if (view.look(dirPlus(this.direction, -3)) != " ")
        start = this.direction = dirPlus(this.direction, -2);
      while (view.look(this.direction) != " ") {
        this.direction = dirPlus(this.direction, 1);
        if (this.direction == start) break;
      }
      return <Action>{type: "move", direction: this.direction};
    }
};


Creaturespecs["BouncingCritter"] = {
  energy: 20, 
  direction: randomElement(directionNames),
  act: function(view: View):Action {
    if (view.look(this.direction) != " ")
      this.direction = view.find(" ") || "s";
      return {type: "move", direction: this.direction};
    }
}


Creaturespecs["Plant"] = {
    energy: 3 + Math.random() * 4,
    direction: '',
    act: function(view: View):Action {
      if (this.energy > 15) {
        var space = view.find(" ");
        if (space)
          return {type: "reproduce", direction: space};
      }
      if (this.energy < 20)
        return {type: "grow", direction: null};
    }
}

Creaturespecs["SmartPlantEater"] = {
    energy:30,
    direction:"e",
    act: function(view: View):Action {
      var space = view.find(" ");
      if (this.energy > 90 && space)
        return {type: "reproduce", direction: space};
      var plants = view.findAll("*");
      if (plants.length > 1)
        return {type: "eat", direction: randomElement(plants)};
      if (view.look(this.direction) != " " && space)
        this.direction = space;
        return {type: "move", direction: this.direction};
    }
}

Creaturespecs["Tiger"] = {
    energy:100 , 
    direction:"w" , 
    act:function(view: View):Action {
      // Average number of prey seen per turn
      var seenPerTurn: number = this.preySeen.reduce(function(a, b) {
        return a + b;
      }, 0) / this.preySeen.length;
      var prey: Array<creature> = view.findAll("O");
      this.preySeen.push(prey.length);
      
      if (this.preySeen.length > 6) // Drop the first element from the array when it is longer than 6
        this.preySeen.shift();
    
      if (prey.length && seenPerTurn > 0.25) // Only eat if the predator saw more than ¼ prey animal per turn
        return {type: "eat", direction: randomElement(prey)};
        
      var space = view.find(" ");
      if (this.energy > 400 && space)
        return {type: "reproduce", direction: space};
      if (view.look(this.direction) != " " && space)
        this.direction = space;
        return {type: "move", direction: this.direction};
    },
    preySeen: []
}
