import { Component, InjectionKey, App, SetupContext, ComponentPublicInstance } from "vue";
import { OverlayConfig, OverlayState } from "./OverlayState";

export class OverlayService {
  static key: InjectionKey<OverlayService> = Symbol('cdk-overlay');
  
  static overlayContainer?: HTMLDivElement;

  constructor(private appRef: App) {
    appRef._container
  }

  create(config?: OverlayConfig): OverlayState {
    return new OverlayState(config);
  }
}