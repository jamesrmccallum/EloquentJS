import {Vector} from '../Objects/Objects'

export function randomPointInRadius(radius: number): Vector {
	for (; ;) {
		var x = Math.random() * 2 - 1;
		var y = Math.random() * 2 - 1;
		if (x * x + y * y <= 1)
			return new Vector(x * radius, y * radius);
	}
}

export function loadImageURL(cx: CanvasRenderingContext2D, url: string) {
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

export function elt(name: string, attributes?: Object, ...args): HTMLElement {
	var node: HTMLElement = document.createElement(name);
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
	
/** Returns cursor position(x,y) relative to client bounding box */
export function relativePos(event: MouseEvent, element: HTMLCanvasElement): Vector {
	var rect = element.getBoundingClientRect();
	return new Vector(
		Math.floor(event.clientX - rect.left),
		Math.floor(event.clientY - rect.top)
	);
}
	
/** Takes a function and binds it to mousemove, takes an optional onEnd to attach something else */
export function trackDrag(onMove: EventListener, onEnd?: EventListener) {
	function end(event) {
		removeEventListener("mousemove", onMove);
		removeEventListener("mouseup", end);
		if (onEnd)
			onEnd(event);
	}
	addEventListener("mousemove", onMove);
	addEventListener("mouseup", end);
}
