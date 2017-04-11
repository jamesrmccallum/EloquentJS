System.register(['./Ch18'], function(exports_1) {
    "use strict";
    var Ch18_1;
    return {
        setters:[
            function (Ch18_1_1) {
                Ch18_1 = Ch18_1_1;
            }],
        execute: function() {
            document.addEventListener("DOMContentLoaded", function (evt) {
                //Javascript workbench 
                var btn = document.querySelector('#button');
                btn.addEventListener('click', Ch18_1.runCode);
                //Autocomplete 
                var searchbox = document.querySelector("#field");
                var completions = document.querySelector('#suggestions');
                searchbox.addEventListener("input", function (e) {
                    Ch18_1.autoComplete(e, searchbox, completions);
                });
                //Game of life 
                var gameContainer = document.querySelector("#gameoflife");
                var game = new Ch18_1.gameOfLife(gameContainer, 10);
                game.draw();
                var gamebtn = document.querySelector("#runGame");
                gamebtn.addEventListener("click", function () {
                    game.turn();
                });
            });
        }
    }
});
