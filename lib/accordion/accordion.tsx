import { defineComponent, DefineComponent, reactive } from "vue";
import { CdkAccordionContainer } from './accordion_container';
import { CdkAccordionItem } from './accordion_item';
import { AccordionDispatcher } from './accordion_dispatcher';
import { AccordionItemSlotBuilder, AccordionItemSlotProps, AccordionSlotProps } from './accordion_type';

export class Accordion {
  private readonly state = reactive({
    multi: false,
    expanded: false
  });

  public readonly element: DefineComponent;

  constructor(builders: AccordionItemSlotBuilder[]) {
    this.element = this.render(builders);
  }

  get expanded() {
    return this.state.expanded;
  }

  get multi() {
    return this.state.multi;
  }

  set multi(value: boolean) {
    this.state.multi = value;
  }

  openAll() {
    this.state.expanded = true;
  }

  closeAll() {
    this.state.expanded = false;
  }

  private accordionItem(
    dispatcher: AccordionDispatcher,
    builder: AccordionItemSlotBuilder,
  ) {
    const slots = {
      default: (state: AccordionItemSlotProps) => builder(state),
    };
    return (
      <CdkAccordionItem
        dispatcher={dispatcher}
        v-slots={slots}
      ></CdkAccordionItem>
    );
  }

  private render(builders: AccordionItemSlotBuilder[]) {
    return defineComponent(() => {
      const accordionSlots = {
        default: ({ dispatcher }: AccordionSlotProps) => {
          return builders.map((builder) => {
            return this.accordionItem(dispatcher, builder);
          });
        }
      };
  
      return () => (
        <CdkAccordionContainer
          expanded={this.state.expanded}
          multi={this.state.multi}
          v-slots={accordionSlots}
        ></CdkAccordionContainer>
      );
    });
  }
}