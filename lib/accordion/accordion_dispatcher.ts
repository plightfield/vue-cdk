/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @class AccordionDispatcher
 */
export class AccordionDispatcher {
  readonly subscribers: ((value: boolean) => void)[] = [];

  subscribe(next: (value: boolean) => void) {
    this.subscribers.push(next);
  }

  notify(value: boolean) {
    this.subscribers.forEach(fn => fn?.(value))
  }
}
