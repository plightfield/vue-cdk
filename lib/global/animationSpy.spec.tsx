import { defineComponent, inject, ref } from "vue";
import { animationSpyToken } from ".";

export default defineComponent({
  name: "animation-spy-text",
  setup() {
    const spy = inject(animationSpyToken)!;
    const delta = ref(0);
    const cb = spy.addCb((dt) => {
      delta.value = dt;
    });
    setTimeout(() => {
      spy.removeCb(cb);
    }, 4000);
    return () => <div>{delta.value}</div>;
  },
});
