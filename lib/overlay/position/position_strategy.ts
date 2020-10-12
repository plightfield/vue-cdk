import { OverlayProps } from '../overlay';

export class PositionStrategy {
  setup(): OverlayProps | undefined {
    return ;
  }

  apply?(overlayWrapper: Element): void {

  }

  disapply?(): void {

  }

  dispose(): void {

  }
}