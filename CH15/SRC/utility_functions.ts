function elt(name: string, className?: string): HTMLElement {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}