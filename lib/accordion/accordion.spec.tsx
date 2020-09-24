import { defineComponent, reactive } from "vue";

import { CdkAccordion, AccordionDispatcher } from './accordion';
import CdkAccordionItem from './accordion_item';

export default defineComponent({
  name: 'cdk-accordion-test',
  setup() {
    const array = reactive([1, 2, 3, 4, 5]);
    const state = reactive({
      multi: false,
      expanded: false
    });

    const widgets = ({ dispatcher }: { dispatcher: AccordionDispatcher }) => {
      return array.map((value) => {
        const slots = {
          default: (state: { expanded: boolean }) => [
            <p>
              Item {value} :
              <button
                onClick={() => state.expanded = !state.expanded}
              >{state.expanded ? 'close' : 'expanded'}</button>
            </p>,
            <p v-show={state.expanded}> I only show if item {value} is expanded </p>
          ]
        };
        return (
          <CdkAccordionItem
            dispatcher={dispatcher}
            v-slots={slots}
          >
          </CdkAccordionItem>
        );
      });
    };
    return () => (
      <>
        <div>accordion is {state.multi ? 'multi' : 'single'}</div>
        <button
          onClick={() => state.multi = !state.multi}
          style="display: block;"
        > click me</button>
        <button
          onClick={() => state.expanded = !state.expanded}
        >{state.expanded ? 'close' : 'open'}</button>

        <CdkAccordion
          expanded={state.expanded}
          multi={state.multi}
          v-slots={{ default: widgets }}
        ></CdkAccordion>
      </>
    );
  }
})