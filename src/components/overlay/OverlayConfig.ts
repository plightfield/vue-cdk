import { PositionStrategy } from "./position/PosotionStrategy";

export interface OverlayConfig {
    strategy?: PositionStrategy;
    backdropClose?: boolean;
}
