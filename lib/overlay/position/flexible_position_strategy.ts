import { OverlayProps } from "../overlay_props";
import { ConnectionPositionPair, OverlayConnectionPosition } from "./position_pair";
import { PositionStrategy } from "./position_strategy";
import { coerceCssPixelValue } from '../../coercion';
import { ComponentInternalInstance, isRef, Ref } from 'vue';
interface Point {
  x: number;
  y: number;
}

export type FlexibleConnectedPositionStrategyOrigin = Element | Ref<Element | ComponentInternalInstance | undefined> | (Point & {
  width?: number;
  height?: number;
});


export class FlexiblePositionStrategy implements PositionStrategy {

  private positionPair: ConnectionPositionPair = new ConnectionPositionPair({
    originX: 'left',
    originY: 'bottom',
  }, {
    overlayX: 'left',
    overlayY: 'top',
  });

  constructor(
    private origin: FlexibleConnectedPositionStrategyOrigin
  ) { }

  setup(): OverlayProps {
    const originRect = this._getOriginRect();
    const point = this._getOriginPoint(originRect, this.positionPair);
    console.log(point);
    return {
      positionedStyle: {
        position: "absolute",
        left: coerceCssPixelValue(point.x),
        top: coerceCssPixelValue(point.y),
        width: coerceCssPixelValue(originRect.width),
        height: coerceCssPixelValue(originRect.height),
      },
      containerStyle: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh'
      }
    }
  }


  setOrigin(origin: FlexibleConnectedPositionStrategyOrigin) {
    this.origin = origin;
  }


  setPositionPair(positionPair: ConnectionPositionPair) {
    this.positionPair = positionPair;
  }


  /**
   * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
   */
  private _getOriginPoint(originRect: ClientRect, position: ConnectionPositionPair): Point {
    let x: number;
    if (position.originX == 'center') {
      x = originRect.left + (originRect.width / 2);
    } else {
      const startX = originRect.left;
      const endX = originRect.right;
      x = position.originX == 'left' ? startX : endX;
    }

    let y: number;
    if (position.originY == 'center') {
      y = originRect.top + (originRect.height / 2);
    } else {
      y = position.originY == 'top' ? originRect.top : originRect.bottom;
    }

    return { x, y };
  }

  /** Returns the ClientRect of the current origin. */
  private _getOriginRect(): ClientRect {
    const origin = this.origin;

    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }

    if (isRef(origin)) {
      if (origin.value instanceof Element) {
        return origin.value.getBoundingClientRect();
      } else {
        // TODO: Get the component's rect
        return {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: 0,
          width: 0
        }
      }
    }

    const width = origin.width || 0;
    const height = origin.height || 0;

    // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
    return {
      top: origin.y,
      bottom: origin.y + height,
      left: origin.x,
      right: origin.x + width,
      height,
      width
    };
  }
}
