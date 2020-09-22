import { defineComponent, inject } from "vue";
import globalProvider, { breakpointToken } from ".";

export default defineComponent({
  name: "breakpoint-spec",
  setup() {
    globalProvider();
    const bp = inject(breakpointToken)!;
    return () => (
      <div>
        <p>span: {bp.span.value}</p>
        <p>direction: {bp.direction.value}</p>
      </div>
    );
  },
});
