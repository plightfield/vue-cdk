import { CSSProperties } from "vue";
import { OverlayProps } from '../overlay_props';



export interface PositionStrategy {
  setup(): OverlayProps;
}