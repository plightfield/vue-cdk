import { App } from "vue";
import { accordion } from "./accordion";
import { accordionItem } from "./accordion_item";

export * from './accordion';
export * from './accordion_item';

export default {
  install(app: App, ...options: any[]) {
    app.directive('cdk-accordion', accordion);
    app.directive('cdk-accordion-item', accordionItem);
  }
}