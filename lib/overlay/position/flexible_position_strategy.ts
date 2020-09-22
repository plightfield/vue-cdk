import { OverlayProps } from "../overlay_props";
import { ConnectionPositionPair } from "./position_pair";
import { PositionStrategy } from "./position_strategy";
import { coerceCssPixelValue } from '../../coercion';
import { ComponentInternalInstance, CSSProperties, isRef, ref, Ref } from 'vue';
interface Point {
  x: number;
  y: number;
}

export type FlexibleConnectedPositionStrategyOrigin = Element | Ref<Element | ComponentInternalInstance | undefined> | (Point & {
  width?: number;
  height?: number;
});


export class FlexiblePositionStrategy implements PositionStrategy {

  private width: number = 100;
  private height: number = 100;

  private positionPair: ConnectionPositionPair = new ConnectionPositionPair({
    originX: 'left',
    originY: 'bottom',
  }, {
    overlayX: 'left',
    overlayY: 'top',
  });

  private currentPositionedStyle = ref<CSSProperties>({});

  private subscribe?: (event: Event) => void;

  constructor(
    private origin: FlexibleConnectedPositionStrategyOrigin
  ) { }

  setup(): OverlayProps {
    const originRect = this._getOriginRect();
    const originPoint = this._getOriginPoint(originRect, this.positionPair);
    const point = this._getOverlayPoint(originPoint, this.positionPair);
    this.currentPositionedStyle.value = {
      position: "absolute",
      left: coerceCssPixelValue(point.x),
      top: coerceCssPixelValue(point.y),
      width: coerceCssPixelValue(this.width),
      height: coerceCssPixelValue(this.height),
    };

    this.caculateScroll(this.currentPositionedStyle, point);

    // why not just return a stream???
    return {
      positionedStyle: this.currentPositionedStyle,
      containerStyle: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh'
      }
    };
  }

  dispose(): void {
    if (this.subscribe) {
      document.removeEventListener('scroll', this.subscribe);
    }
  }


  setOrigin(origin: FlexibleConnectedPositionStrategyOrigin) {
    this.origin = origin;
    return this;
  }


  setPositionPair(positionPair: ConnectionPositionPair) {
    this.positionPair = positionPair;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }


  private _getOverlayPoint(originPoint: Point, position: ConnectionPositionPair): Point {
    let x: number;
    if (position.overlayX == 'center') {
      x = originPoint.x - this.width / 2;
    } else {
      x = position.overlayX == 'left' ? originPoint.x : (originPoint.x - this.width);
    }

    let y: number;
    if (position.overlayY == 'center') {
      y = originPoint.y - (this.height / 2);
    } else {
      y = position.overlayY == 'top' ? originPoint.y : (originPoint.y - this.height);
    }

    return { x, y };
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

  caculateScroll(style: Ref<CSSProperties>, originPoint: Point) {
    this.subscribe = function (event: Event) {
      const nowTop = window.pageYOffset;
      style.value.top = coerceCssPixelValue(originPoint.y - nowTop);
      style.value = style.value;
    }
    document.addEventListener('scroll', this.subscribe);
  }
}
