// ! no mixin
// ! no directive
// ! no filter
// ! cdk should not have any of upper cases
// components
import Test from "./Test";
import { overlayPlugin } from "./overlay";
import { collectionsPlugin } from './collections';

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
    injectComponents(app, [Test]);
    overlayPlugin.install(app, options);
    collectionsPlugin.install(app, options);
  },
  Test,
};

// import {xxx,xxx} from 'cdk'
export const CdkTest = Test;

export * from './overlay';
