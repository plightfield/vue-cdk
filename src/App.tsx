import { defineComponent } from "vue";
import globalProvider from "../lib/global";
import Test from "../lib/Test";

const App = defineComponent(function () {
  globalProvider();
  return () => (
    <>
      <Test />
    </>
  );
});

export default App;
