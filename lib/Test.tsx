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
        <BIDI />
        <BP />
        <PLAT />
        <OverlayTest />
      </>
    );
  },
});
