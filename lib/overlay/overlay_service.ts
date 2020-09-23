import { inject, InjectionKey } from "vue";
import { OverlayState } from "./overlay_state";
import { OverlayConfig } from "./overlay_config";
import { GlobalPositionStrategy } from "./position/global_position_strategy";
import {
  FlexiblePositionStrategy,
  FlexiblePositionStrategyOrigin,
} from "./position/flexible_position_strategy";
import { platformToken } from "../global";

/**
 * @description
 * overlay service.
 *
 * @date 2020-09-14
 * @export
 * @interface OverlayService
 */
export class OverlayService {
  constructor(private hostElement: HTMLElement, private body: HTMLElement) {}

  create(config: OverlayConfig) {
    return new OverlayState(config, this.body);
  }

  createPositionStrategy(type: "global"): GlobalPositionStrategy;
  createPositionStrategy(
    type: "flexible",
    origin: FlexiblePositionStrategyOrigin
  ): FlexiblePositionStrategy;
  createPositionStrategy(
    type: "global" | "flexible",
    ...args: any[]
  ): FlexiblePositionStrategy | GlobalPositionStrategy {
    if (type == "global") {
      return new GlobalPositionStrategy();
    } else {
      const platform = inject(platformToken)!;
      return new FlexiblePositionStrategy(args[0], window, platform.BODY!);
    }
  }
}
