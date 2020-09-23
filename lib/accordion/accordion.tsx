import { method } from "lodash";
import { defineComponent, Directive, DirectiveBinding, reactive, ref, renderSlot, watch } from "vue";

let nextId = 0;

export const accordion: Directive = {
  mounted(el, binding: DirectiveBinding) {
    
  }
}

export interface AccordionProps {
  multi: boolean;
  onExpanded: (value: boolean) => void;
}

export default defineComponent({
  // props: {
  //   multi: {
  //     type: Boolean,
  //     default: false,
  //   }
  // },
  props: ['multi'],
  name: 'cdk-accordion',
  setup(props, ctx) {
    const expanded = ref(false);

    watch(expanded, (value) => {
      // props.onExpanded(value);
    });
  },

  data(): {id: string, expanded: boolean} {
    return {
      id: `cdk_accordion_${nextId++}`,
      expanded: false,
    };
  },

  render() {
    return (
      <>
        {`${this.$data.expanded}`}
        {renderSlot(this.$slots, 'default')}
      </>
    );
  }
});