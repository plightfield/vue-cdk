import { computed, onBeforeUnmount, Ref, shallowRef, toRaw, watch } from "vue";
import { set as _set } from "lodash";
import {
  asapScheduler,
  asyncScheduler,
  Observable,
  queueScheduler,
  Subject,
  animationFrameScheduler,
} from "rxjs";
import { observeOn } from "rxjs/operators";

/**
 * return type of immerRef
 *
 * @export
 * @interface ImmerData
 * @template T
 */
export interface ImmerData<T> {
  value: T;
  setValue: (val: any, keys?: string) => void;
  data$: Observable<T>;
}

/**
 * attach localstorage handler with try block
 *
 * @param {string} key
 * @param {*} val
 */
function tryJsonSet(key: string, val: any) {
  let result = "";
  try {
    result = JSON.stringify(val);
  } catch (err) {
    throw new Error("cannot parse json in localstorage");
  }
  localStorage.setItem(key, result);
}

/**
 * implements ref with
 * *immutable state
 * use with
 * *localstorage
 * or transform it to
 * *Rxjs BehaviroSubject
 * !notice that only first layout Array will be handled
 *
 * @export
 * @template T
 * @param {T} initialValue
 * @param {string} [storageKey]
 * @returns {ImmerData<T>}
 */
export default function immerRef<T>(
  initialValue: T,
  storageKey?: string
): ImmerData<T> {
  const _data = shallowRef<T>(initialValue);
  const setData = (val: any, keys?: string) => {
    if (keys === undefined) {
      _data.value = val;
      return;
    }
    const keyList = keys.split(".").filter((res) => res);
    if (keyList.length > 0) {
      let result = { ..._set(_data.value as any, keyList, val) };
      let isArray =
        Object.prototype.toString.call(initialValue) === "[object Array]";
      let haveNaNKey = false;
      if (isArray) {
        let len = 0;
        for (let key in result) {
          if (parseInt(key) === NaN) {
            haveNaNKey = true;
            break;
          }
          len++;
        }
        result.length = len;
      }
      // *if initial value is array and dont have nan key
      result =
        isArray && !haveNaNKey ? Array.prototype.slice.call(result) : result;
      _data.value = result;
    } else {
      _data.value = val;
    }
  };

  // add storage functionality
  if (storageKey) {
    tryJsonSet(storageKey, _data.value);
    watch(_data, (val) => {
      tryJsonSet(storageKey, val);
    });
  }

  const data$ = new Observable<T>((observer) => {
    watch(
      _data,
      (val) => {
        observer.next(val);
      },
      { immediate: true, flush: "sync" }
    );
    onBeforeUnmount(() => {
      observer.complete();
    });
  });

  return {
    value: _data.value,
    setValue: setData,
    data$,
  };
}
