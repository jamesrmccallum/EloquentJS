import {World} from './Environment';

var plan: string[] =      ["####################################################",
                           "#                 ####         ****              ###",
                           "#   *     ##                 ########       OO    ##",
                           "#   *    ##        O O                 ****       *#",
                           "#       ##*       @                ##########     *#",
                           "#      ##***  *         ****                     **#", 
                           "#* **  #  *  ***      #########                  **#",
                           "#* **  #      *               #   *              **#",
                           "#     ##              #   O   #  ***          ######",
                           "#*                    #       #   *        O  #    #",
                           "#*                    #  ######                 ** #",
                           "###          ****          ***                  ** #",
                           "#       O                        @         O       #",
                           "#   *     ##  ##  ##  ##               ###      *  #",
                           "#   **         #              *       #####  O     #",
                           "##  **  O   O  #  #    ***  ***        ###      ** #",
                           "###      @        #   *****                    ****#",
                           "####################################################"];

export var world = new World(plan, { "#": "Wall", "@": "Tiger", "O": "SmartPlantEater", "*": "Plant" });

var active = null;

class Animated {
  private disabled: boolean;
  private button: HTMLDivElement;
  private pre: HTMLPreElement;
  private interval: number;

  constructor(public world: World) {
   
    let outer: HTMLElement = document.body;
    let doc: HTMLDocument = outer.ownerDocument;
    let node: HTMLDivElement = <HTMLDivElement>outer.appendChild(doc.createElement("div"));
    let self: Animated = this;

    node.style.cssText = "position: relative; width: intrinsic; width: fit-content;";
    this.pre = <HTMLPreElement>node.appendChild(doc.createElement("pre"));
    this.pre.appendChild(doc.createTextNode(this.world.toString()));
    this.button = <HTMLDivElement>node.appendChild(doc.createElement("div"));
    this.button.style.cssText = "position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; " +
    "background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;";
    this.button.innerHTML = "stop";
    this.button.addEventListener("click", () => { self.clicked(); });
    this.disabled = false;
    if (active) active.disable();
    active = this;
    this.interval = setInterval(()=> { self.tick(); }, 333);
  }

  clicked(): void {
    if (this.disabled) return;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.button.innerHTML = "start";
    } else {
      var self = this;
      this.interval = setInterval(() => { self.tick(); }, 333);
      this.button.innerHTML = "stop";
    }
  }

  tick(): void {
    this.world.turn();
    this.pre.removeChild(this.pre.firstChild);
    this.pre.appendChild(this.pre.ownerDocument.createTextNode(this.world.toString()));
  }

  disable(): void {
    this.disabled = true;
    clearInterval(this.interval);
    this.button.innerHTML = "Disabled";
    this.button.style.color = "red";
  }
}


window["animateWorld"] = ()=> {
  new Animated(world);
};

