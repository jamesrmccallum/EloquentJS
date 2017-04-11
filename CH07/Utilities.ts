///<reference path = "./all.d.ts" />

import {directionNames} from './Environment';

export function randomElement(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

export function charFromElement(element) {
  return element == null ? " " : element.originChar;
}

export function dirPlus(dir: string, n: number) {
  let index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

            
