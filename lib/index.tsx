// ! no mixin
// ! no directive
// ! no filter
// ! cdk should not have any of upper cases
// components
import Test from "./Test";
import { overlayPlugin } from "./overlay";
import { platformPlugin } from "./platform";

import OverlayTest from "./overlay/test";
import PlatformTest from "./platform/test";

// functions
import eventStream from "./eventStream";
import immerRef from "./immerRef";
import computedStream from "./computedStream";

/**
 * ruled component template name
 *
 * @param {*} app
 * @param {any[]} components
 */
function injectComponents(app: any, components: any[]) {
  for (let component of components) {
    app.component("cdk-" + component.name, component);
  }
}

// default export
// import cdk from 'cdk'
// *cdx.xxx Cdk.XXX
export default {
  install(app: any, options: any) {
    injectComponents(app, [Test, OverlayTest, PlatformTest]);
    overlayPlugin.install(app, options);
    platformPlugin.install(app, options);
  },
  eventStream,
  immerRef,
  computedStream,
  Test,
};

// import {xxx,xxx} from 'cdk'
export const cdkEventStream = eventStream;
export const cdkImmerRef = immerRef;
export const cdkComputedStream = computedStream;
export const CdkTest = Test;
