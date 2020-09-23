import { defineComponent } from "vue";
import BIDI from "./global/bidirection.spec";
import BP from "./global/breakpoint.spec";
import PLAT from "./global/platform.spec";
import OverlayTest from './overlay/overlay.spec';

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
        <OverlayTest />
      </>
    );
  },
});
