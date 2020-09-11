import {
  defineComponent,
  reactive,
  toRaw,
  ref,
  unref,
  isReactive,
  isRef,
} from "vue";
const Test = defineComponent(function () {
  const a = reactive({ a: 2 });
  const test = ref({ test: "sss" });
  return () => <div>this is test</div>;
});
Test.displayName = "test-component";

export default Test;
