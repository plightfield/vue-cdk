import { defineComponent, watch } from "vue";
import immerRef from "../lib/immerRef";

const App = defineComponent(function () {
  const { value, setValue, data$ } = immerRef({ test: 1 }, "fuck", true);
  data$.subscribe(console.log);
  return () => (
    <div>
      <input
        value={value.test}
        onInput={(e: any) => {
          setValue(e.target.value, "test");
        }}
      />
    </div>
  );
});
App.displayName = "app";

export default App;
