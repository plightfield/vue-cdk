import { Component, InjectionKey, App } from "vue";
import { OverlayConfig, OverlayState } from "./OverlayState";

export class OverlayService {
  static key: InjectionKey<OverlayService> = Symbol('cdk-overlay');
  
  static overlayContainer?: HTMLDivElement;


  portalContainer: Component;

  constructor(private appRef: App) {
    // this.portalContainer = Portal;
  }

  create(config?: OverlayConfig): OverlayState {
    return new OverlayState(config);
  }
}