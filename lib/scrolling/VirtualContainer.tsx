import { defineComponent, inject, renderSlot } from "vue";
import VirtualScroll from "./virtualScroll";
import "./VirtualContainer.less";
export default defineComponent({
  name: "cdk-virtual-container",
  setup(_, ctx) {
    const virtualScroll = inject("cdk-virtual-scroll")! as VirtualScroll;
    return () => (
      <div class='cdk-virtual-container' ref={virtualScroll.containerRef}>
        <div style={{ height: virtualScroll.totalHeight.value + "px" }}></div>
        <div
          class='cdk-virtual-content'
          style={{ left: 0, top: virtualScroll.before.value + "px" }}
        >
          {renderSlot(ctx.slots, "default")}
        </div>
      </div>
    );
  },
});
