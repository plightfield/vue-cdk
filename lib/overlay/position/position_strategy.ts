import { OverlayProps } from '../overlay_props';



export interface PositionStrategy {
  setup(): OverlayProps;

  attach?(): void;

  detach?(): void;

  dispose(): void;
}