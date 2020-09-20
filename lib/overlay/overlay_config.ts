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
    strategy: PositionStrategy;
    backdropClose?: boolean;
}
