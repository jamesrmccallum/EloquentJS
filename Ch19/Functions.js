System.register(['../Objects/Objects'], function(exports_1) {
    "use strict";
    var Objects_1;
    function randomPointInRadius(radius) {
        for (;;) {
            var x = Math.random() * 2 - 1;
            var y = Math.random() * 2 - 1;
            if (x * x + y * y <= 1)
                return new Objects_1.Vector(x * radius, y * radius);
        }
    }
    exports_1("randomPointInRadius", randomPointInRadius);
    function loadImageURL(cx, url) {
        var image = document.createElement("img");
        image.addEventListener("load", () => {
            var color = cx.fillStyle, size = cx.lineWidth;
            cx.canvas.width = image.width;
            cx.canvas.height = image.height;
            cx.drawImage(image, 0, 0);
            cx.fillStyle = color;
            cx.strokeStyle = color;
            cx.lineWidth = size;
        });
        image.src = url;
    }
    exports_1("loadImageURL", loadImageURL);
    function elt(name, attributes, ...args) {
        var node = document.createElement(name);
        if (attributes) {
            for (var attr in attributes)
                if (attributes.hasOwnProperty(attr))
                    node.setAttribute(attr, attributes[attr]);
        }
        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            if (typeof child == "string")
                child = document.createTextNode(child);
            node.appendChild(child);
        }
        return node;
    }
    exports_1("elt", elt);
    /** Returns cursor position(x,y) relative to client bounding box */
    function relativePos(event, element) {
        var rect = element.getBoundingClientRect();
        return new Objects_1.Vector(Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top));
    }
    exports_1("relativePos", relativePos);
    /** Takes a function and binds it to mousemove, takes an optional onEnd to attach something else */
    function trackDrag(onMove, onEnd) {
        function end(event) {
            removeEventListener("mousemove", onMove);
            removeEventListener("mouseup", end);
            if (onEnd)
                onEnd(event);
        }
        addEventListener("mousemove", onMove);
        addEventListener("mouseup", end);
    }
    exports_1("trackDrag", trackDrag);
    return {
        setters:[
            function (Objects_1_1) {
                Objects_1 = Objects_1_1;
            }],
        execute: function() {
        }
    }
});
