System.register([], function(exports_1) {
    "use strict";
    var Vector;
    return {
        setters:[],
        execute: function() {
            class Vector {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.x = x;
                    this.y = y;
                }
                move(v) {
                    let x = this.x + v.x;
                    let y = this.y + v.y;
                    return new Vector(x, y);
                }
                /**Return a new Vector which represents the old plus the new */
                plus(other) {
                    return new Vector(this.x + other.x, this.y + other.y);
                }
                times(factor) {
                    return new Vector(this.x * factor, this.y * factor);
                }
            }
            Vector = Vector;
        }
    }
});
