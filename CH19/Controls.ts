
import {elt, loadImageURL} from './Functions';
import {Tools} from './Tools';

export var Controls = {

	openURL: (cx: CanvasRenderingContext2D): HTMLFormElement => {
		var input = <HTMLInputElement>elt("input", { type: "text" });
		var form = <HTMLFormElement>elt("form", null,
			"Open URL: ", input,
			elt("button", { type: "submit" }, "load"));
		form.addEventListener("submit", event => {
			event.preventDefault();
			loadImageURL(cx, input.value);
		});
		return form;
	},

	clear: (cx: CanvasRenderingContext2D): HTMLButtonElement => {

		let button = <HTMLButtonElement>elt("button", { type: "submit" }, "clear");

		button.addEventListener('click', () => { cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height) });

		return button;
	},

	tool: (cx: CanvasRenderingContext2D) => {
		let select = <HTMLSelectElement>elt("select");
		let toolkit = Tools;
		for (var name in toolkit)

			select.appendChild(elt("option", null, name));

		cx.canvas.addEventListener("mousedown", function(ev: MouseEvent) {
			if (ev.which == 1) {
				toolkit[select.value](ev, cx);
				event.preventDefault();
			}
		});

		return elt("span", null, "Tool: ", select);
	},

	openFile: (cx: CanvasRenderingContext2D) => {
		var input = <HTMLInputElement>elt("input", { type: "file" });

		input.addEventListener("change", ()=> {
			if (input.files.length == 0) return;
			var reader = new FileReader();
			reader.addEventListener("load", () =>{
				loadImageURL(cx, reader.result);
			});
			reader.readAsDataURL(input.files[0]);
		});
		return elt("div", null, "Open file: ", input);
	},

	brushSize: (cx: CanvasRenderingContext2D) => {
		var select = <HTMLSelectElement>elt("select");
		var sizes: Array<number> = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];

		sizes.forEach(function(size: number) {
			select.appendChild(elt("option", { value: size },
				size + " pixels"));
		});
		select.addEventListener("change", function() {
			cx.lineWidth = parseInt(select.value);
		});
		return elt("span", null, "Brush size: ", select);
	},
	
	color: (cx: CanvasRenderingContext2D) => {
		var input = <HTMLInputElement>elt("input", { type: "color" });

		input.addEventListener("change", function() {
			cx.fillStyle = input.value;
			cx.strokeStyle = input.value;
		});
		return elt("span", null, "Color: ", input);
	},

	save: (cx: CanvasRenderingContext2D) => {
		var link = <HTMLLinkElement>elt("a", { href: "/" }, "Save");
		function update() {
			try {
				link.href = cx.canvas.toDataURL();
			} catch (e) {
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
}
