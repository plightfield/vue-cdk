// export const CdkCell: Directive<Element> = {
//   beforeMount(el) {
//     // if (!(el instanceof HTMLTableRowElement)) {
//     //   throw Error('CdkCell directive must binding <tr> tag!');
//     // }
//     // el
//     // el.name = 'cdk-cell';
//     el.attributes.setNamedItem(document.createAttribute('cdk-cell'));
//     console.log(el);
//   }
// }

import { Directive } from "vue";

// export const CdkHeaderCell: Directive<Element> = {
//   beforeMount(el) {
//     el.attributes.setNamedItem(document.createAttribute('cdk-header-cell'));
//   }
// }

export const CdkColumnDef: Directive<Element, string> = {
  beforeMount(el, binding) {
    const attr = document.createAttribute(`cdk-column-def`);
    attr.value = binding.value;
    el.attributes.setNamedItem(attr);
  }
}

// export const CdkRow