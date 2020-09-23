import { defineComponent } from "vue";
import BIDI from "./global/bidirection.spec";
import BP from "./global/breakpoint.spec";
import PLAT from "./global/platform.spec";
import OVERLAY from './overlay/overlay.spec';
import CB from "./global/clipboard.spec";
import ACCORDION from './accordion/accordion.spec';

export default defineComponent({
  name: "test",
  setup() {
    return () => (
      <>
        <h2>bidirection</h2>
        <BIDI />
        <h2>breakpoint</h2>
        <BP />
        <h2>platform</h2>
        <PLAT />
        <h2>overlay</h2>
        <OVERLAY />
        <h2>clipboard</h2>
        <CB />
        <h2>accordion</h2>
        <ACCORDION />
      </>
    );
  },
});
