import { defineComponent, watch } from "vue";
import immerRef from "../lib/immerRef";

const App = defineComponent(function () {
  const [some, setSome] = immerRef({ test: 1 }, "fuck");

  watch(some, console.log);
  return () => (
    <div>
      <input
        value={some.value.test}
        onInput={(e: any) => {
          setSome(e.target.value, "test");
        }}
      />
    </div>
  );
});
App.displayName = "app";

export default App;
