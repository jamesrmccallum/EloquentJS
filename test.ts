function arrayToList(a) {
    var ret ={};
    for(var i = a.length-1; i > 0; i--) {
        ret = {value: a[i], rest: ret}
    }
    return ret;
}

function listToArray(a) {
    var ret = [];
    for (var node = a; node; node = node.rest){
      if (node.value !== undefined) {
        ret.push(node.value);  
      }
    }
    return ret;    
};
function prepend(a: Object,rest: Object) {     
    var ret: Object = {value: undefined, rest: undefined};        
    ret[value] = a;
    ret[rest] = rest;
    return ret;
}

function deepEqual(obj1: Object,obj2: Object) {
    var chk: boolean = true;
     
    Object.getOwnPropertyNames(obj1).forEach( function(val, idx, ary) {
        if(typeof(obj1[val]) == 'object') {  // if this is an object.. 
            if(!deepEqual(obj1[val],obj2[val])) {
                chk = false;
            }
        } else if (obj1[val] !== obj2[val])  {// if it's not..
                chk = false;
        } 
    })
    return chk; 
};

var arrays = [[1, 2, 3], [4, 5], [6]];

function flattener(inArray: Object){
    
     
    
} 