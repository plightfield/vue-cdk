import { defineComponent, renderSlot, toRef, watch } from "vue";

export class AccordionDispatcher {
  readonly subscribers: ((value: boolean) => void)[] = [];

  subscribe(next: (value: boolean) => void) {
    this.subscribers.push(next);
  }

  notify(value: boolean) {
    this.subscribers.forEach(fn => fn?.(value))
  }
}

export const CdkAccordion = defineComponent({
  props: {
    multi: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  name: 'cdk-accordion',
  setup(props, ctx) {
    const dispatcher = new AccordionDispatcher();

    watch(toRef(props, 'expanded'), (value) => {
      if (props.multi) {
        dispatcher.notify(value);
      }
    });
    
    return () => (
      <>      
        {renderSlot(ctx.slots, 'default', {dispatcher})}
      </>
    );
  }
});