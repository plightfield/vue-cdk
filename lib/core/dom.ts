export function addEvent<E extends Element>(target: E, type: string, fn: (event: Event) => void) {
  target.addEventListener(type, fn);
  return function destroy() {
    target.removeEventListener(type, fn);
  }
}
