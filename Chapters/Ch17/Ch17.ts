///<reference path="../../Typings/es6-promise.d.ts"/>
function get(url: string, header:string) {
  return new Promise(function(succeed, fail) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("Accept",header);
    req.addEventListener("load", function() {
      if (req.status < 400)
        succeed(req.responseText);
      else
        fail(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
      fail(new Error("Network error"));
    });
    req.send(null);
  });
}

function all<T>(promises: Array<Promise<T>>){
  return new Promise(function(success, fail) {
    promises.forEach(function(p){
      p.then(function(success){
      
      }, function(fail) {
        return fail; 
      }
    )})
  })
}