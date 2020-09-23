import { PositionStrategy } from "./position/position_strategy";

/**
 * @description
 * overlay config.
 * 
 * @date 2020-09-14
 * @export
 * @interface OverlayConfig
 */
export interface OverlayConfig {
  readonly strategy: PositionStrategy;
  readonly backdropClose?: boolean;
  readonly backdropClick?: () => void;
  readonly backgroundBlock?: boolean;
  readonly backgroundClass?: string | string[];
}
