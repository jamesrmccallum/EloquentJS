define(["require", "exports"], function (require, exports) {
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector.prototype.move = function (v) {
            var x = this.x + v.x;
            var y = this.y + v.y;
            return new Vector(x, y);
        };
        Vector.prototype.plus = function (other) {
            return new Vector(this.x + other.x, this.y + other.y);
        };
        Vector.prototype.times = function (factor) {
            return new Vector(this.x * factor, this.y * factor);
        };
        return Vector;
    })();
    exports.Vector = Vector;
});
