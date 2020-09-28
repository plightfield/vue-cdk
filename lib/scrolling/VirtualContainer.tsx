import { defineComponent, inject, renderSlot } from "vue";
import VirtualScroll from "./virtualScroll";
import "./VirtualContainer.less";
import { reactToService } from "../tools";
export default defineComponent({
  name: "cdk-virtual-container",
  setup(_, ctx) {
    const virtualScroll = inject("cdk-virtual-scroll")! as VirtualScroll;
    const reactor = reactToService(virtualScroll.dirty);
    return () => (
      <div class='cdk-virtual-container' ref={virtualScroll.containerRef}>
        {reactor.value}
        <div style={{ height: virtualScroll.totalHeight + "px" }}></div>
        <div
          class='cdk-virtual-content'
          style={{ left: 0, top: virtualScroll.beforeHeight + "px" }}
        >
          {renderSlot(ctx.slots, "default")}
        </div>
      </div>
    );
  },
});
