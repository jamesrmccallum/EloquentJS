System.register(['./Functions', './Tools'], function(exports_1) {
    "use strict";
    var Functions_1, Tools_1;
    var Controls;
    return {
        setters:[
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            },
            function (Tools_1_1) {
                Tools_1 = Tools_1_1;
            }],
        execute: function() {
            exports_1("Controls", Controls = {
                openURL: (cx) => {
                    var input = Functions_1.elt("input", { type: "text" });
                    var form = Functions_1.elt("form", null, "Open URL: ", input, Functions_1.elt("button", { type: "submit" }, "load"));
                    form.addEventListener("submit", event => {
                        event.preventDefault();
                        Functions_1.loadImageURL(cx, input.value);
                    });
                    return form;
                },
                clear: (cx) => {
                    let button = Functions_1.elt("button", { type: "submit" }, "clear");
                    button.addEventListener('click', () => { cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height); });
                    return button;
                },
                tool: (cx) => {
                    let select = Functions_1.elt("select");
                    let toolkit = Tools_1.Tools;
                    for (var name in toolkit)
                        select.appendChild(Functions_1.elt("option", null, name));
                    cx.canvas.addEventListener("mousedown", function (ev) {
                        if (ev.which == 1) {
                            toolkit[select.value](ev, cx);
                            event.preventDefault();
                        }
                    });
                    return Functions_1.elt("span", null, "Tool: ", select);
                },
                openFile: (cx) => {
                    var input = Functions_1.elt("input", { type: "file" });
                    input.addEventListener("change", () => {
                        if (input.files.length == 0)
                            return;
                        var reader = new FileReader();
                        reader.addEventListener("load", () => {
                            Functions_1.loadImageURL(cx, reader.result);
                        });
                        reader.readAsDataURL(input.files[0]);
                    });
                    return Functions_1.elt("div", null, "Open file: ", input);
                },
                brushSize: (cx) => {
                    var select = Functions_1.elt("select");
                    var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
                    sizes.forEach(function (size) {
                        select.appendChild(Functions_1.elt("option", { value: size }, size + " pixels"));
                    });
                    select.addEventListener("change", function () {
                        cx.lineWidth = parseInt(select.value);
                    });
                    return Functions_1.elt("span", null, "Brush size: ", select);
                },
                color: (cx) => {
                    var input = Functions_1.elt("input", { type: "color" });
                    input.addEventListener("change", function () {
                        cx.fillStyle = input.value;
                        cx.strokeStyle = input.value;
                    });
                    return Functions_1.elt("span", null, "Color: ", input);
                },
                save: (cx) => {
                    var link = Functions_1.elt("a", { href: "/" }, "Save");
                    function update() {
                        try {
                            link.href = cx.canvas.toDataURL();
                        }
                        catch (e) {
                            if (e instanceof Error)
                                link.href = "javascript:alert(" +
                                    JSON.stringify("Can't save: " + e.toString()) + ")";
                            else
                                throw e;
                        }
                    }
                    link.addEventListener("mouseover", update);
                    link.addEventListener("focus", update);
                    return link;
                }
            });
        }
    }
});
