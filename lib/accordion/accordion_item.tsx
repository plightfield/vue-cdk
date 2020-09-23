import { defineComponent, h, inject, ref, render, renderSlot} from "vue";
import { uniqueSelectionDispatcherToken } from "../collections";

let nextId = 0;

export default defineComponent({
  name: 'cdk-accordion-item',

  props:{
    expanded: {
      type: Boolean,
      default: false,
    },
    onOpened: {
      type: Function,
    }
  },

  setup(props, ctx) {
    const expanded = ref(false);
    console.log(ctx.slots); 
    return () => (
      <>
        {renderSlot(ctx.slots, 'default', {expanded})}
      </>
    );
  },

  mounted() {
    const dispatcher = inject(uniqueSelectionDispatcherToken);
    if (this.$parent) {
      (this.$parent.$data as any).expanded = true;
    }
  },
});
