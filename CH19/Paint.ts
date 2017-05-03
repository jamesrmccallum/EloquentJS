
import {elt} from './Functions'
import {Controls} from './Controls'

function createPaint(parent: HTMLElement) {
	var canvas: HTMLCanvasElement = <HTMLCanvasElement>elt("canvas", { width: 500, height: 300 });
	var cx = canvas.getContext("2d");
	var toolbar = <HTMLDivElement>elt("div", { class: "toolbar" });

	for (name in Controls)
		toolbar.appendChild(Controls[name](cx));

	var panel = elt("div", { class: "picturepanel" }, canvas);
	parent.appendChild(elt("div", null, panel, toolbar));
}








