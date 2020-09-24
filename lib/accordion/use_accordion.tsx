import { VNodeChild, reactive } from 'vue';
import { AccordionDispatcher, CdkAccordion } from './accordion';
import {CdkAccordionItem} from './accordion_item';


export const useAccordion = (renderFunctions: ((state: { expanded: boolean }, index: number) => JSX.Element[] | VNodeChild)[]) => {
  const state = reactive({
    multi: false,
    expanded: false
  });

  const accordionSlots = {
    default: ({ dispatcher }: { dispatcher: AccordionDispatcher }) => {
      return renderFunctions.map((fn, index) => {
        const slots = {
          default: (state: { expanded: boolean }) => fn(state, index),
        };
        return (
          <CdkAccordionItem
            dispatcher={dispatcher}
            v-slots={slots}
          ></CdkAccordionItem>
        );
      });
    }
  };

  const element = () => (
    <CdkAccordion
      expanded={state.expanded}
      multi={state.multi}
      v-slots={accordionSlots}
    ></CdkAccordion>
  )

  return {
    state,
    element
  }
};
