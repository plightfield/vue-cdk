import { isReactive, ref, isRef, Ref, reactive, toRaw } from "vue";

export default class Utils {
  static setRef<T>(val: any) {
    if (isReactive(val)) return ref(toRaw(val));
    if (isRef(val)) return val;
    return ref(val) as Ref<T>;
  }

  static uuid() {
    return (
      "token-" + ~~(Math.random() * 10000).toString() + Date.now().toString()
    );
  }
}
