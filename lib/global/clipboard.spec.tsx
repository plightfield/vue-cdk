import { defineComponent, inject, ref } from "vue";
import globalProvider, { clipboardToken } from ".";

const Container = () => <div></div>;

export default defineComponent({
  name: "clipboard-spec",
  setup() {
    globalProvider();
    const test = ref("test copy");
    const clipboard = inject(clipboardToken)!;
    const clip = () => {
      clipboard.copy(test.value);
    };
    return () => (
      <>
        <textarea v-model={test.value} />
        <button onClick={clip}>clip</button>
      </>
    );
  },
});
