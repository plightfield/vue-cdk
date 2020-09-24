import { defineComponent, reactive, renderSlot, toRef, watch} from "vue";
import { AccordionDispatcher } from './accordion';

export default defineComponent({
  name: 'cdk-accordion-item',
  props: {
    dispatcher: {
      type: AccordionDispatcher,
      default: new AccordionDispatcher(),
    },
    onExpanded: {
      type: Function,
    },
  },

  setup(props, ctx) {
    const state = reactive({expanded: false});

    props.dispatcher.subscribe((value: boolean) => {
      state.expanded = value;
    });

    watch(toRef(state, 'expanded'), (value) => {
      console.log('value', value);
    });

    return () => (
      <>
        {renderSlot(ctx.slots, 'default', state)}
      </>
    );
  }
});
