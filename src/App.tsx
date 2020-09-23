import { defineComponent } from "vue";
import Test from "../lib/Test";

const App = defineComponent(function () {
  return () => (
    <>
      <Test />
    </>
  );
});

export default App;
