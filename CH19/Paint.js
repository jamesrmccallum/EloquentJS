System.register(['./Functions', './Controls'], function(exports_1) {
    "use strict";
    var Functions_1, Controls_1;
    function createPaint(parent) {
        var canvas = Functions_1.elt("canvas", { width: 500, height: 300 });
        var cx = canvas.getContext("2d");
        var toolbar = Functions_1.elt("div", { class: "toolbar" });
        for (name in Controls_1.Controls)
            toolbar.appendChild(Controls_1.Controls[name](cx));
        var panel = Functions_1.elt("div", { class: "picturepanel" }, canvas);
        parent.appendChild(Functions_1.elt("div", null, panel, toolbar));
    }
    return {
        setters:[
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            },
            function (Controls_1_1) {
                Controls_1 = Controls_1_1;
            }],
        execute: function() {
        }
    }
});
