import { customRef } from "vue";
import { Observable } from "rxjs";

export default function <T>(stream$: Observable<T>) {
  let value: T;
  return customRef((track, trigger) => {
    stream$.subscribe((res) => {
      trigger();
      value = res;
    });
    return {
      get() {
        track();
        return value;
      },
      set() {},
    };
  });
}
