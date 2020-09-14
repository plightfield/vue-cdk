import { defineComponent } from "vue";
import { cdkImmerRef, cdkComputedStream } from "../lib";

const App = defineComponent(function () {
  const { value, setValue, data$ } = cdkImmerRef({ test: 1 }, "fuck");
  const buttonText = cdkComputedStream(data$);
  return () => (
    <div>
      <input
        value={value.test}
        onInput={(e: any) => {
          setValue(e.target.value, "test");
        }}
      />
      <button>{buttonText?.test}</button>
    </div>
  );
});
App.displayName = "app";

export default App;
