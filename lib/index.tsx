import { Plugin } from "vue";

import Test from "./Test";

function injectComponents(app: any, components: any[]) {
  for (let component of components) {
    app.component("cdk-" + component.displayName, component);
  }
}

export default {
  install(app, options) {
    injectComponents(app, [Test]);
  },
} as Plugin;
