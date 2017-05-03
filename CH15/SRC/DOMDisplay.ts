
import {IActor} from './Actors';
import {gameConfig} from './Game';
import {Level} from './Level'

let cfg = gameConfig;

export class DOMDisplay {
  public wrap: HTMLDivElement;
  public actorLayer: any;

  constructor(parent: HTMLDivElement, public level: Level) {
    this.wrap = <HTMLDivElement>parent.appendChild(elt("div", "game"));
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;
    this.drawFrame();
  }

  drawBackground(): HTMLTableElement {
    var table = <HTMLTableElement>elt("table", "background");
    table.style.width = this.level.width * cfg.scale + "px";
    this.level.grid.forEach((row)=> {
      var rowElt = <HTMLTableRowElement>table.appendChild(elt("tr"));
      rowElt.style.height = cfg.scale + "px";
      row.forEach((type)=> {
        rowElt.appendChild(elt("td", type));
      });
    });
    return table;
  };

  drawActors() {
    var wrap = elt("div");
    this.level.actors.forEach(a=> {
      var rect = <HTMLDivElement>wrap.appendChild(elt("div", "actor " + a.type));
      rect.style.width = a.size.x * cfg.scale + "px";
      rect.style.height = a.size.y * cfg.scale + "px";
      rect.style.left = a.pos.x * cfg.scale + "px";
      rect.style.top = a.pos.y * cfg.scale + "px";
    });
    return wrap;
  };
  
  drawFrame(step?: number) {
    if (this.actorLayer)
      this.wrap.removeChild(this.actorLayer);
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.wrap.className = "game " + (this.level.status || "");
    this.scrollPlayerIntoView();
  };

  scrollPlayerIntoView() {
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width / 3;

    // The viewport
    let left = this.wrap.scrollLeft, right = left + width;
    let top = this.wrap.scrollTop, bottom = top + height;

    let player = this.level.player;
    let center = player.pos.plus(player.size.times(0.5)).times(cfg.scale);

    if (center.x < left + margin)
      this.wrap.scrollLeft = center.x - margin;
    else if (center.x > right - margin)
      this.wrap.scrollLeft = center.x + margin - width;
    if (center.y < top + margin)
      this.wrap.scrollTop = center.y - margin;
    else if (center.y > bottom - margin)
      this.wrap.scrollTop = center.y + margin - height;
  };
  
  clear() {
    this.wrap.parentNode.removeChild(this.wrap);
  };

}










