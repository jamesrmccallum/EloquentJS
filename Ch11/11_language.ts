
interface ExpressionTree {
  type: string; 
  operator?: Expression;
  args?: Array<Expression>;
  value?: any;
  name?: string;  
}

interface ExpressionTreeNode {
  expr: Expression;
  rest: string; 
}

interface Expression {
  type: string; 
  value?: any;
  name?: string; 
};

function parseExpression(program: string): any {
  program = skipSpace(program);
  var match: Array<any> 
  var expr: ExpressionTree;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  string = string.replace(/#.*\n/,""); //Strip comments
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

//Can return a tree node {Expression, Rest}
function parseApply(expr: ExpressionTree, program: string): ExpressionTreeNode {
  program = skipSpace(program);
  if (program[0] != "(")
    return <ExpressionTreeNode> {expr: expr, rest: program};  

  program = skipSpace(program.slice(1));
  
  expr = {type: "apply", operator: expr, args: []};
  
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest); //Clean spaces 
    if (program[0] == ",") // If comma 
      program = skipSpace(program.slice(1));
    else if (program[0] != ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return parseApply(expr, program.slice(1));
}

export function parse(program: string): Expression {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}

function evaluate(expr: ExpressionTree, env: Environment) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " +
                                 expr.name);
    case "apply":
      if (expr.operator.type == "word" && expr.operator.name in specialForms)
        return specialForms[expr.operator.name](expr.args,env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

interface ISpecialForm {
  (a: any[], e: Environment):any;
}

interface SpecialFormDict {[name: string]: ISpecialForm}

 
var specialForms: SpecialFormDict = {};

specialForms["if"] = (a,e) => {
  if (a.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(a[0], e) !== false)
    return evaluate(a[1], e);
  else
    return evaluate(a[2], e);
};

specialForms["while"] = (a,e) => {
  if (a.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(a[0], e) !== false)
    evaluate(a[1], e);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["do"] = (a,e) => {
  let value = false;
  a.forEach(arg => {
    value = evaluate(arg, e);
  });
  return value;
};

specialForms["define"] = (a,e)=> {
  if (a.length != 2 || a[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var value = evaluate(a[1], e);
  e[a[0].name] = value;
  return value;
};

specialForms["fun"] = function(args: Array<Expression>, env: Environment) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr: Expression) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  
  var argNames: Array<string> = args.slice(0, args.length - 1).map(name);
  var body:Expression = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv: Environment = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return evaluate(body, localEnv);
  };
};

specialForms["set"] = function(args: Array<Expression>, env: Environment) {
  var propname: string = args[0].name; 
  var parent: Environment = Object.getPrototypeOf(env);
  // If it's already on the scope, set it, if not look up to parent, else error
  if(Object.prototype.hasOwnProperty.call(env, propname)) {
    env[propname] = evaluate(args[1], env);
  }
  if (Object.prototype.hasOwnProperty.call(parent,propname)) {
    parent[propname] = evaluate(args[1], env);
  }
  else {
    throw new ReferenceError("NO SUCH VARIBLE IN SCOPE, MUCKER");
  }
};


// NAMESPACE CREATOR 
interface Environment {[operation: string]: any;}

var topEnv :Environment = {}; 

topEnv["true"] = true;
topEnv["false"] = false;

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

topEnv["array"] = function(...args: Array<any>) {
  var ret = []; 
  var v = Array.prototype.slice.call(arguments,0);
  if(v.length > 1) {ret = ret.concat(v);}
  else {ret = ret.concat(v.split(','))}
  return ret;
};

topEnv["length"] = function(ary: Array<any>) {
  return arguments[0].length;
};

topEnv["element"] = function(ary: Array<any>,idx: number) {
  if(idx >= ary.length) {throw new Error('array out of bounds')};
  return ary[idx];
};

export function run(...args: Array<string>) {
  var env: Environment = Object.create(topEnv);
  var program: string = Array.prototype.slice.call(args, 0).join("\n");
  return evaluate(parse(program),env);
};
