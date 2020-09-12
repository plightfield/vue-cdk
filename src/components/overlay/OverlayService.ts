import { Component, InjectionKey, App, SetupContext, ComponentPublicInstance } from "vue";
import { OverlayConfig } from "./OverlayConfig";
import { OverlayState } from "./OverlayState";

export class OverlayService {
  static key: InjectionKey<OverlayService> = Symbol('cdk-overlay');
  
  static overlayContainer?: HTMLDivElement;

  constructor() {}

  create(config: OverlayConfig) {
    return new OverlayState(config.strategy, config.backdropClose);
  }
}