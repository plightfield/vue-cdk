import { CSSProperties } from "vue";
import { OverlayProps } from '../OverlayProps';

export interface PositionStrategy {
  setup(): OverlayProps;
}