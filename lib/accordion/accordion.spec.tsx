import { defineComponent, reactive, VNode, VNodeChild } from "vue";
import { useAccordion } from './use_accordion';

export default defineComponent({
  name: 'cdk-accordion-test',
  setup() {
    const array = reactive([1, 2, 3, 4, 5]);

    const accordion = useAccordion(array.map((value) => (state) => [
      <p>
        Item {value} :
          <button onClick={() => state.expanded = !state.expanded}>
          {state.expanded ? 'close' : 'expanded'}
        </button>
      </p>,
      <p v-show={state.expanded}>
        I only show if item {value} is expanded
      </p>
    ]));
    return () => (
      <>
        <div>accordion is {accordion.state.multi ? 'multi' : 'single'}</div>
        <button
          onClick={() => accordion.state.multi = !accordion.state.multi}
          style="display: block;"
        > click me</button>
        <button
          onClick={() => accordion.state.expanded = !accordion.state.expanded}
        >{accordion.state.expanded ? 'close' : 'open'}</button>

        <accordion.element />
      </>
    );
  }
})