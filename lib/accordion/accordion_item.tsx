import { defineComponent, reactive, renderSlot, toRef, watch} from "vue";
import { AccordionDispatcher } from './accordion';

export interface AccordionItemSlotProps { 
  expanded: boolean;
}

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkAccordionItem
 */
export const CdkAccordionItem = defineComponent({
  name: 'cdk-accordion-item',
  props: {
    dispatcher: {
      type: AccordionDispatcher,
      default: new AccordionDispatcher(),
    }
  },

  setup(props, ctx) {
    const state = reactive<AccordionItemSlotProps>({expanded: false});

    props.dispatcher.subscribe((value: boolean) => {
      state.expanded = value;
    });

    return () => (
      <>
        {renderSlot(ctx.slots, 'default', state)}
      </>
    );
  }
});
