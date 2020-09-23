import { defineComponent } from "vue";
import globalProvider from "../lib/global";
import Test from "../lib/Test";

const App = defineComponent(function () {
  globalProvider();
  return () => (
    <div>
      <Test />
    </div>
  );
});
App.displayName = "app";

export default App;
