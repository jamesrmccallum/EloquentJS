///<reference path="./All.d.ts"/>

function createPaint(parent: HTMLElement) {
	var canvas: HTMLCanvasElement = <HTMLCanvasElement>Functions.elt("canvas", { width: 500, height: 300 });
	var cx = canvas.getContext("2d");
	var toolbar = <HTMLDivElement>Functions.elt("div", { class: "toolbar" });

	for (var name in Controls)
		toolbar.appendChild(Controls[name](cx));

	var panel = Functions.elt("div", { class: "picturepanel" }, canvas);
	parent.appendChild(Functions.elt("div", null, panel, toolbar));
}








