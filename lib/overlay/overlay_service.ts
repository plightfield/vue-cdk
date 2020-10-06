import { OverlayState } from "./overlay_state";
import { OverlayConfig } from "./overlay_config";
import { GlobalPositionStrategy } from "./position/global_position_strategy";
import {
  FlexiblePositionStrategy,
  FlexiblePositionStrategyOrigin,
} from "./position/flexible_position_strategy";
import { provide } from 'vue';

/**
 * @description
 * overlay service.
 *
 * @date 2020-09-14
 * @export
 * @interface OverlayService
 */
export class OverlayService {

  constructor(private document: Document) {
    let div = document.getElementById('vue-cdk-overlay');
    if (!div) {
      div = document.createElement('div');
      div.id = 'vue-cdk-overlay';
      div.className = 'vue-cdk-overlay-container';
      document.body.append(div);
    }
  }

  create(config: OverlayConfig) {
    return new OverlayState({
      hasBackdrop: config.hasBackdrop || true,
      backdropClose: config.backdropClose || true,
      backdropClick: config.backdropClick || null,
      strategy: config.strategy,
      backgroundClass: config.backgroundClass || '',
      backgroundBlock: config.backgroundBlock || false,
    }, this.document.body);
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
      return new FlexiblePositionStrategy(args[0], window);
    }
  }
}
