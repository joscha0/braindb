import type { Page } from "../server/types";

function replaceItemAtIndex(arr: Page[], index: number, newValue: Page) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: Page[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export { replaceItemAtIndex, removeItemAtIndex };
