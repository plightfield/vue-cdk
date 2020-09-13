import { Component, InjectionKey, App, SetupContext, ComponentPublicInstance } from "vue";
import { OverlayState } from "./overlay_state";
import { OverlayConfig } from "./overlay_config";

export class OverlayService {
  static key: InjectionKey<OverlayService> = Symbol('cdk-overlay');
  
  static overlayContainer?: HTMLDivElement;

  constructor() {}

  create(config: OverlayConfig) {
    return new OverlayState(config.strategy, config.backdropClose);
  }
}