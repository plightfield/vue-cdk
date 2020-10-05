import { defineComponent, onMounted, ref } from "vue";
import ViewportRuler from "./viewportRuler";

export default defineComponent({
  name: "viewport-ruler-spec",
  setup() {
    const viewport = new ViewportRuler();
    const rect = viewport.viewportRect;
    return () => (
      <div>
        <p>{JSON.stringify(rect.value)}</p>
      </div>
    );
  },
});
