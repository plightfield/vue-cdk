import { PositionStrategy } from "./position/position_strategy";

export interface OverlayConfig {
    strategy?: PositionStrategy;
    backdropClose?: boolean;
}
