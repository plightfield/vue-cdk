import { CSSProperties } from "vue";

interface OverlayStyleProps {
  style: CSSProperties;
  parentStyle: CSSProperties;
}

export interface PositionStrategy {
  setup(): OverlayStyleProps;
}