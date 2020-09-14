import {
  customRef,
  nextTick,
  onBeforeUnmount,
  readonly,
  ref,
  shallowRef,
  watch,
} from "vue";
import { Observable } from "rxjs";
import immerRef from "./immerRef";

/**
 * use rxjs stream as a computed source
 *
 * @export
 * @template T
 * @param {Observable<T>} stream$
 * @returns
 */
export default function <T>(stream$: Observable<T>) {
  const { value, setValue } = immerRef<T>(null as any);
  stream$.subscribe((res) => {
    console.log(res);
    setValue(res);
  });
  return value;
  // let value: T;
  // return customRef((track, trigger) => {
  //   const subscriber = stream$.subscribe(async (res) => {
  //     trigger();
  //     value = res;
  //   });
  //   onBeforeUnmount(() => {
  //     subscriber.unsubscribe();
  //   });
  //   return {
  //     get: () => {
  //       track();
  //       return value;
  //     },
  //     set() {
  //       console.warn("computedStream cannot set");
  //     },
  //   };
  // });
}
