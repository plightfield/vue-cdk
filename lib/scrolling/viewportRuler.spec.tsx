import { defineComponent, onMounted, ref } from "vue";
import ViewportRuler from "./viewportRuler";

export default defineComponent({
  name: "viewport-ruler-spec",
  setup() {
    const viewport = new ViewportRuler();
    const size = ref({ width: 0, height: 0 });
    onMounted(() => {
      size.value = viewport.getViewportRect();
    });
    return () => (
      <div>
        <p>{JSON.stringify(size.value)}</p>
      </div>
    );
  },
});
