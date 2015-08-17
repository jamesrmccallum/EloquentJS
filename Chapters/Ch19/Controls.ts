///reference path="./all.d.ts"/>

module Controls {

	export function openURL(cx: CanvasRenderingContext2D): HTMLFormElement {
		var input = <HTMLInputElement>Functions.elt("input", { type: "text" });
		var form = <HTMLFormElement>Functions.elt("form", null,
			"Open URL: ", input,
			Functions.elt("button", { type: "submit" }, "load"));
		form.addEventListener("submit", function(event) {
			event.preventDefault();
			Functions.loadImageURL(cx, input.value);
		});
		return form;
	};
	
	export function clear(cx: CanvasRenderingContext2D) {
		
		var button = Functions.elt("button",{type: "submit"},"clear");
		
		button.addEventListener('click',()=>{cx.clearRect(0,0,cx.canvas.width,cx.canvas.height)});
			
		return button;
	}

	export function tool(cx: CanvasRenderingContext2D) {
		var select = <HTMLSelectElement>Functions.elt("select");
		var toolkit = Tools.Tools;
		for (var name in toolkit)

			select.appendChild(Functions.elt("option", null, name));

		cx.canvas.addEventListener("mousedown", function(ev: MouseEvent) {
			if (ev.which == 1) {
				toolkit[select.value](ev, cx);
				event.preventDefault();
			}
		});

		return Functions.elt("span", null, "Tool: ", select);
	};

	export function openFile(cx: CanvasRenderingContext2D) {
		var input = <HTMLInputElement>Functions.elt("input", { type: "file" });

		input.addEventListener("change", function() {
			if (input.files.length == 0) return;
			var reader = new FileReader();
			reader.addEventListener("load", function() {
				Functions.loadImageURL(cx, reader.result);
			});
			reader.readAsDataURL(input.files[0]);
		});
		return Functions.elt("div", null, "Open file: ", input);
	};

	export function brushSize(cx: CanvasRenderingContext2D) {
		var select = <HTMLSelectElement>Functions.elt("select");
		var sizes: Array<number> = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];

		sizes.forEach(function(size: number) {
			select.appendChild(Functions.elt("option", { value: size },
				size + " pixels"));
		});
		select.addEventListener("change", function() {
			cx.lineWidth = parseInt(select.value);
		});
		return Functions.elt("span", null, "Brush size: ", select);
	};

	export function color(cx: CanvasRenderingContext2D) {
		var input = <HTMLInputElement>Functions.elt("input", { type: "color" });

		input.addEventListener("change", function() {
			cx.fillStyle = input.value;
			cx.strokeStyle = input.value;
		});
		return Functions.elt("span", null, "Color: ", input);
	};

	export function save(cx: CanvasRenderingContext2D) {
		var link = <HTMLLinkElement>Functions.elt("a", { href: "/" }, "Save");
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
	};

}