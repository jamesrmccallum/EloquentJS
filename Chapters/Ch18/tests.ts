///<reference path="./Ch18.ts"/>

document.addEventListener("DOMContentLoaded", function(evt: Event) {

	//Javascript workbench 
	var btn: HTMLButtonElement = <HTMLButtonElement> document.querySelector('#button');
	btn.addEventListener('click', runCode)
	
	
	//Autocomplete 
	var searchbox: HTMLInputElement = <HTMLInputElement> document.querySelector("#field");
	var completions: HTMLDivElement = <HTMLDivElement> document.querySelector('#suggestions');
	searchbox.addEventListener("input", function(e) {
		autoComplete(e,searchbox,completions);
	});
	
	//Game of life 
	
});