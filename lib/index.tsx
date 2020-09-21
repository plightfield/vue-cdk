import { Plugin } from "vue";

import Test from "./Test";
import OverlayTest from './overlay/Test';
import { overlay } from './overlay';

function injectComponents(app: any, components: any[]) {
  for (let component of components) {
    app.component("cdk-" + component.displayName, component);
  }
}

export default {
  install(app, options) {
    injectComponents(app, [Test, OverlayTest]);
    overlay.install(app, options);
  },
} as Plugin;
