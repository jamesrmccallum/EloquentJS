///<reference path="./Level.ts"/>
///<reference path="./utility_functions.ts"/>
///<refrence path="./Actor.ts"/>

class DOMDisplay {
  public wrap: HTMLDivElement;
  public level: Level;
  public actorLayer: any;

  constructor(parent: HTMLElement, level: Level) {
    this.wrap = <HTMLDivElement>parent.appendChild(elt("div", "game"));
    this.level = level;
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;
    this.drawFrame();
  }

  drawBackground(): HTMLTableElement {
    var table = <HTMLTableElement>elt("table", "background");
    table.style.width = this.level.width * scale + "px";
    this.level.grid.forEach(function(row) {
      var rowElt = <HTMLTableRowElement>table.appendChild(elt("tr"));
      rowElt.style.height = scale + "px";
      row.forEach(function(type) {
        rowElt.appendChild(elt("td", type));
      });
    });
    return table;
  };

  drawActors() {
    var wrap = elt("div");
    this.level.actors.forEach(function(actor) {
      var rect = <HTMLDivElement>wrap.appendChild(elt("div", "actor " + actor.type));
      rect.style.width = actor.size.x * scale + "px";
      rect.style.height = actor.size.y * scale + "px";
      rect.style.left = actor.pos.x * scale + "px";
      rect.style.top = actor.pos.y * scale + "px";
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
    var left = this.wrap.scrollLeft, right = left + width;
    var top = this.wrap.scrollTop, bottom = top + height;

    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5))
      .times(scale);

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










