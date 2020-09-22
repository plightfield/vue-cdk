import { defineComponent } from "vue";
import Test from "../lib/Test";

const App = defineComponent(function () {
  return () => (
    <div>
      <Test />
    </div>
  );
});
App.displayName = "app";

export default App;
