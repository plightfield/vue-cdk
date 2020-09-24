import { CdkAny } from 'lib/types';
import { VNodeChild, reactive } from 'vue';
import { AccordionDispatcher, CdkAccordionContainer } from './accordion_container';
import { AccordionItemSlotProps, CdkAccordionItem } from './accordion_item';
import { AccordionItemBuilder, AccordionItemSlotBuilder, AccordionSlotProps } from './accordion_type';

export const useAccordionItem = (
  dispatcher: AccordionDispatcher,
  builder: AccordionItemSlotBuilder,
) => {
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

/**
 * @description
 * assembly accordion component in an easy way.
 * @date 2020-09-24
 * @export
 * @function useAccordion
 */
export const useAccordion = (builders: AccordionItemSlotBuilder[]) => {
  const state = reactive({
    multi: false,
    expanded: false
  });

  const accordionSlots = {
    default: ({ dispatcher }: AccordionSlotProps) => {
      return builders.map((builder) => {
        return useAccordionItem(dispatcher, builder);
      });
    }
  };

  const element = () => (
    <CdkAccordionContainer
      expanded={state.expanded}
      multi={state.multi}
      v-slots={accordionSlots}
    ></CdkAccordionContainer>
  )

  return {
    state,
    element
  }
};

/**
 * @description
 * assembly accordion component in an easy way.
 * @date 2020-09-24
 * @export
 * @function useCustomAccordion
 */
export const useCustomAccordion = (builders: AccordionItemBuilder[]) => {
  const state = reactive({
    multi: false,
    expanded: false
  });

  const accordionSlots = {
    default: ({ dispatcher }: AccordionSlotProps) => {
      return builders.map((builder) => {
        return builder(dispatcher);
      });
    }
  };

  const element = () => (
    <CdkAccordionContainer
      expanded={state.expanded}
      multi={state.multi}
      v-slots={accordionSlots}
    ></CdkAccordionContainer>
  )

  return {
    state,
    element
  }
}
