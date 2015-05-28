///<reference path="creatures.ts"/>
///<reference path="actions.ts"/>
///<reference path="utilities.ts"/>
///<reference path="environment.ts"/>
///<reference path="animate.ts"/>

var plan: Array<string> = ["############################",
  				                "#      #    #      o      ##",
			            "#                          #",
			            "#          #####           #",
			            "##         #   #    ##     #",
			            "###           ##     #     #",
			            "#           ###      #     #",
			            "#   ####                   #",
			            "#   ##       o             #",
			            "# o  #         o       ### #",
			            "#    #                     #",
			            "############################"];
                  
var directions: Object = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

var directionNames: Array<string> = "n ne e se s sw w nw".split(" ");

var world: World = new World(plan, {"#": "Wall", "o": "BouncingCritter"});

var valley: LifelikeWorld = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": "Wall",
   "O": "PlantEater",
   "*": "Plant"}
);

var w = new eLife.Animated(world);
var animateWorld: Function = function(world) { w };


