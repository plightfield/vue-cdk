import { onBeforeUnmount, Ref, shallowRef, watch } from "vue";
import { set as _set } from "lodash";
import { BehaviorSubject } from "rxjs";

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
 * other layer of array will be set to plain object
 *
 * @export
 * @template T
 * @param {T} initialValue
 * @param {string} [storageKey]
 * @param {boolean} [subscribe]
 * @returns {{value:T, setValue:(val: any, keys?: string) => void,data$: BehaviorSubject<T>}
 */
export default function immerRef<T>(
  initialValue: T,
  storageKey?: string,
  subscribe?: boolean
): {value:T, setValue:(val: any, keys?: string) => void,data$: BehaviorSubject<T> {
  const _data = shallowRef<T>(initialValue);
  const data$ = new BehaviorSubject<T>(initialValue);
  const setData = (val: any, keys?: string) => {
    if (keys === undefined) {
      _data.value = val;
      return;
    }
    const keyList = keys.split(".").filter((res) => res);
    if (keyList.length > 0) {
      let result = Object.assign({}, _set(_data.value as any, keyList, val));
      let isArray = Object.prototype.toString.call(initialValue) === "[object Array]";
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
      _data.value =
        isArray && !haveNaNKey ? Array.prototype.slice.call(result) : result;
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

  // add BehaviorSubject transformation
  if (subscribe) {
    data$.subscribe((res) => {
      if (res !== _data.value) {
        _data.value === res;
      }
    });
  }

  watch(_data, (val) => {
    data$.next(val);
  });

  onBeforeUnmount(() => {
    data$.unsubscribe();
  });
  return {
    value: _data.value,
    setValue: setData,
    data$,
  };
}
