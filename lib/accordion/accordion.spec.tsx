import { defineComponent, Ref, renderList } from "vue";

import CdkAccordion from './accordion';
import CdkAccordionItem from './accordion_item';

export default defineComponent({
  name: 'cdk-accordion-test',
  setup() {

    const widgets = [1, 2, 3, 4, 5].map(() => {
      console.log('fuck');

      const slot = (item: {expanded: Ref<boolean>}) => (
          <p>
            test:
            <button onClick={() => item.expanded.value = true}>expand</button>
            <button onClick={() => item.expanded.value = false}>collapse</button>
          </p>
        );
      return (
        <CdkAccordionItem>
          {slot}
        </CdkAccordionItem>
      )
    });
    return () => (
      <CdkAccordion>
        {widgets}
      </CdkAccordion>
    )
  }
})