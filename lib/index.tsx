import { Plugin } from "vue";

import Test from "./Test";
import { overlayPlugin } from './overlay';
import { platformPlugin } from './platform';

import OverlayTest from './overlay/test';
import PlatformTest from './platform/test';

function injectComponents(app: any, components: any[]) {
  for (let component of components) {
    app.component("cdk-" + component.name, component);
  }
}

export default {
  install(app, options) {
    injectComponents(app, [Test, OverlayTest, PlatformTest]);
    overlayPlugin.install(app, options);
    platformPlugin.install(app, options);
  },
} as Plugin;
