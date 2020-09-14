import { defineComponent } from "vue";
import { cdkImmerRef } from "../lib";

const App = defineComponent(function () {
  const { value, setValue, data$ } = cdkImmerRef({ test: 1 }, "fuck", true);
  data$.subscribe(console.log);
  return () => (
    <div>
      <input
        value={value.test}
        onInput={(e: any) => {
          setValue(e.target.value, "test");
        }}
      />
      <button>testsetstset</button>
    </div>
  );
});
App.displayName = "app";

export default App;
