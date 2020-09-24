import { reactive, ref, Ref, watch } from "vue"
import { accordion } from "./accordion";


interface AccordionStruct {
  expanded: false;
  children?: AccordionStruct[];
}

interface AccordionState {
  expanded: Ref<boolean>;
  children?: AccordionState[];
}

const useAccordion = (structs: AccordionStruct[]) => {
  const recusive = (_structs: AccordionStruct[]) => {
    const states = [];
    for (const struct of _structs) {
      const state: AccordionState = {
        expanded: ref(struct.expanded),
      }
      let children: AccordionState[];
      if (Array.isArray(struct.children)) {
        children = recusive(struct.children);
      } else {
        children = [];
      }
      watch(state.expanded, (value) => {
        if (!state.expanded) {
          
        }
      })
      states.push(state);
    }
    return states;
  };
  recusive(structs);
}