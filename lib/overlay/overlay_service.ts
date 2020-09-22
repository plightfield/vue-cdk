import { InjectionKey } from "vue";
import { OverlayState } from "./overlay_state";
import { OverlayConfig } from "./overlay_config";

/**
 * @description
 * overlay service.
 * 
 * @date 2020-09-14
 * @export
 * @interface OverlayService
 */
export class OverlayService {
  static key: InjectionKey<OverlayService> = Symbol('cdk-overlay');

  constructor(private hostElement: HTMLElement) { }

  create(config: OverlayConfig) {
    return new OverlayState(config.strategy, config.backdropClose ?? true);
  }
}