import {VNode, Component, ComponentPublicInstance} from 'vue';
export interface OverlayConfig {
  width?: string,
  height?: string,
}

export class OverlayState {

  constructor(config?: OverlayConfig) {}

  build(component: Component) {
    // this.container
  }
}


