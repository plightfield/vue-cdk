import { onBeforeUnmount, ref } from "vue";
import { Subject } from "rxjs";

/**
 * trans the event call back to
 * *Subject stream
 *
 * @export
 * @template T
 * @returns
 * subject$, handleCb
 */
export default function <T>() {
  const subject$ = new Subject<T>();
  const handleCb = (args: T) => {
    subject$.next(args);
  };
  onBeforeUnmount(() => {
    subject$.unsubscribe();
  });
  return {
    handleCb,
    subject$,
  };
}
