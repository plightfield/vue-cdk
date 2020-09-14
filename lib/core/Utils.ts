import { isReactive, ref, isRef, Ref, reactive, toRaw } from "vue";
export default class Utils {
  static token() {
    return (
      "token-" + ~~(Math.random() * 10000).toString() + Date.now().toString()
    );
  }
}
