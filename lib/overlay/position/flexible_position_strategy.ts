import { OverlayProps } from "../overlay_props";
import { ConnectionPositionPair } from "./position_pair";
import { PositionStrategy } from "./position_strategy";
import { coerceCssPixelValue } from '../../coercion';
import { ComponentInternalInstance, ComponentPublicInstance, CSSProperties, isRef, onMounted, ref, Ref } from 'vue';
interface Point {
  x: number;
  y: number;
}

export type FlexiblePositionStrategyOrigin = Element | Ref<Element | undefined> | (Point & {
  width?: number;
  height?: number;
});

/**
 * @description
 * Flexible position strategy can let your overlay
 * content flexible in a overlay wrapper dom.
 * @date 2020-09-22
 * @export
 * @class FlexiblePositionStrategy
 */
export class FlexiblePositionStrategy implements PositionStrategy {

  private _width: number = 100;
  private _height: number = 100;

  private _positionPair: ConnectionPositionPair = new ConnectionPositionPair({
    originX: 'left',
    originY: 'bottom',
  }, {
    overlayX: 'left',
    overlayY: 'top',
  });

  private currentPositionedStyle = ref<CSSProperties>({});


  
  private subscribe?: () => void;

  private isVisible = false;

  constructor(
    private _origin: FlexiblePositionStrategyOrigin,
    private window: Window, 
  ) { }

  setup(): OverlayProps {
    const originRect = this._getOriginRect();

    // calculate the origin point
    const originPoint = this._getOriginPoint(originRect, this._positionPair);

    // calculate the overlay anchor point
    const point = this._getOverlayPoint(originPoint, this._positionPair);

    // set the current position style's value.
    // the current position style is a 'ref'.
    this.currentPositionedStyle.value = {
      position: "absolute",
      left: coerceCssPixelValue(point.x),
      top: coerceCssPixelValue(point.y),
      width: coerceCssPixelValue(this.width),
      height: coerceCssPixelValue(this.height),
    };

    // at last, we need to caculate the position when
    // scrolling.
    this.caculateScroll(this.currentPositionedStyle, point);

    // why not just return a stream???
    // prefer using rxjs...
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

  attach(): void {
    this.isVisible = true;
    this.subscribe?.();
  }

  detach(): void {
    this.isVisible = false;
  }

  dispose(): void {
    if (this.subscribe) {
      this.window.removeEventListener('scroll', this.subscribe);
    }
  }

  /**
   * Sets the origin of the overlay.
   * 
   * @param value New origin.
   */
  origin(value: FlexiblePositionStrategyOrigin) {
    this._origin = value;
    return this;
  }

  /**
   * Sets the position pair of the overlay.
   * In flexible overlay, you need to mark 
   * two anchor points, one is the element
   * you want to anchor on it, the another
   * one is Overlay.
   * @param value New position pair.
   */
  positionPair(value: ConnectionPositionPair) {
    this._positionPair = value;
    return this;
  }

  /**
   * Sets the height of the overlay.
   * @param height New height.
   */
  height(height: number): this {
    this._height = height;
    return this;
  }

  /**
   * Sets the width of the overlay.
   * @param width New width.
   */
  width(width: number): this {
    this._width = width;
    return this;
  }

  private _getOverlayPoint(originPoint: Point, position: ConnectionPositionPair): Point {
    let x: number;
    if (position.overlayX == 'center') {
      x = originPoint.x - this._width / 2;
    } else {
      x = position.overlayX == 'left' ? originPoint.x : (originPoint.x - this._width);
    }

    let y: number;
    if (position.overlayY == 'center') {
      y = originPoint.y - (this._height / 2);
    } else {
      y = position.overlayY == 'top' ? originPoint.y : (originPoint.y - this._height);
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
    const origin = this._origin;

    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }

    if (isRef(origin)) {
      console.log('target', (this._origin as any).value.$el);

      if (origin.value instanceof Element) {
        return origin.value.getBoundingClientRect();
      } else {
        return {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: 0,
          width: 0,
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
    let offsetX = window.pageXOffset;
    let offsetY = window.pageYOffset;
    this.subscribe = () => {
      if (this.isVisible) {
        const nowTop = this.window.pageYOffset;
        const nowLeft = this.window.pageXOffset;
        style.value.left = coerceCssPixelValue(originPoint.x - nowLeft + offsetX);
        style.value.top = coerceCssPixelValue(originPoint.y - nowTop + offsetY);
        // trigger change
        style.value = style.value;
      }
    }
    this.window.addEventListener('scroll', this.subscribe);
  }
}
