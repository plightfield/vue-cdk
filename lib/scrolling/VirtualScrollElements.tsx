import { defineComponent, inject, mergeProps, reactive, renderSlot } from "vue";
import VirtualScroll from "./virtualScroll";
export const VirtualContainer = defineComponent({
  name: "cdk-virtual-container",
  setup(_, ctx) {
    const virtualScroll = inject("cdk-virtual-scroll")! as VirtualScroll;
    return () => (
      <div
        style='position:relative;overflow: auto;'
        ref={virtualScroll.containerRef}
      >
        <div style={{ height: virtualScroll.beforeOffset + "px" }}></div>
        {renderSlot(ctx.slots, "default")}
        <div style={{ height: virtualScroll.afterOffset + "px" }}></div>
      </div>
    );
  },
});

export const VirtualItem = defineComponent({
  name: "cdk-virtual-item",
  props: {
    height: { type: Number, default: 0 },
    defaultHeight: { type: Number, default: 100 },
    active: { type: Boolean, default: false },
  },
  setup(
    props: {
      height: number;
      defaultHeight: number;
      active: boolean;
    },
    ctx
  ) {
    return () =>
      props.active ? (
        <div style={{ height: props.height || props.defaultHeight }}>
          {renderSlot(ctx.slots, "default")}
        </div>
      ) : null;
  },
});
