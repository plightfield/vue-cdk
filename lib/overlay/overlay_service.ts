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
  constructor(private hostElement: HTMLElement, private body: HTMLElement) { }

  create(config: OverlayConfig) {
    return new OverlayState(config, this.body);
  }
}