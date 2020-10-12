import { defineComponent } from "vue";
import globalProvider from "../lib/global";
import Test from '../lib/Test';

const App = defineComponent({
  props: {
    name: { type: String, default: "" },
  },
  setup(props: { name: string }) {
    globalProvider();
    return function () {
      return (
        <>
          <Test />
        </>
      );
    };
  },
});

export default App;
