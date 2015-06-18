function runCode(evt) {
    var codepane = document.querySelector('#code');
    var output = document.querySelector('#output');
    var code = codepane.innerHTML;
    var fun = new Function(code);
    try {
        var result = fun();
    }
    catch (err) {
        var result = err;
    }
    output.innerText = result;
}
function autoComplete(evt, text, completions) {
    function clear() {
        while (completions.firstChild) {
            completions.removeChild(completions.firstChild);
        }
    }
    clear();
    if (!terms) {
        var terms = [];
        for (var name in window) {
            terms.push(name);
        }
    }
    var search = text.value;
    var hits = terms.filter(function (t) {
        return t.indexOf(search) > -1;
    });
    for (var i = 0; i < hits.length; i++) {
        var d = document.createElement("div");
        d.innerHTML = hits[i];
        d.addEventListener("click", function (evt) {
            var div = evt.currentTarget;
            text.value = div.innerHTML;
            clear();
        });
        completions.appendChild(d);
    }
}
///<reference path="./Ch18.ts"/>
document.addEventListener("DOMContentLoaded", function (evt) {
    //Javascript workbench 
    var btn = document.querySelector('#button');
    btn.addEventListener('click', runCode);
    //Autocomplete 
    var searchbox = document.querySelector("#field");
    var completions = document.querySelector('#suggestions');
    searchbox.addEventListener("input", function (e) {
        autoComplete(e, searchbox, completions);
    });
});
