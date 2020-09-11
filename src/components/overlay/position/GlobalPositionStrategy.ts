import { CSSProperties } from "vue";
import { PositionStrategy } from "./PosotionStrategy";


export class GlobalPositionStrategy implements PositionStrategy {
  private _cssPosition: 'static' | 'absolute' | 'fixed' | 'relative' = 'static';
  private _topOffset: string = '';
  private _bottomOffset: string = '';
  private _leftOffset: string = '';
  private _rightOffset: string = '';
  private _alignItems: string = '';
  private _justifyContent: string = '';
  private _width: string = '';
  private _height: string = '';
  private _isDisposed: boolean;

  /**
   * Sets the top position of the overlay. Clears any previously set vertical position.
   * @param value New top offset.
   */
  top(value: string = ''): this {
    this._bottomOffset = '';
    this._topOffset = value;
    this._alignItems = 'flex-start';
    return this;
  }

  /**
   * Sets the left position of the overlay. Clears any previously set horizontal position.
   * @param value New left offset.
   */
  left(value: string = ''): this {
    this._rightOffset = '';
    this._leftOffset = value;
    this._justifyContent = 'flex-start';
    return this;
  }

  /**
   * Sets the bottom position of the overlay. Clears any previously set vertical position.
   * @param value New bottom offset.
   */
  bottom(value: string = ''): this {
    this._topOffset = '';
    this._bottomOffset = value;
    this._alignItems = 'flex-end';
    return this;
  }

  /**
   * Sets the right position of the overlay. Clears any previously set horizontal position.
   * @param value New right offset.
   */
  right(value: string = ''): this {
    this._leftOffset = '';
    this._rightOffset = value;
    this._justifyContent = 'flex-end';
    return this;
  }

  /**
   * Sets the overlay width and clears any previously set width.
   * @param value New width for the overlay
   * @deprecated Pass the `width` through the `OverlayConfig`.
   * @breaking-change 8.0.0
   */
  width(value: string = ''): this {
    this._width = value;
    return this;
  }

  /**
   * Sets the overlay height and clears any previously set height.
   * @param value New height for the overlay
   * @deprecated Pass the `height` through the `OverlayConfig`.
   * @breaking-change 8.0.0
   */
  height(value: string = ''): this {
    this._height = value;
    return this;
  }

  /**
   * Centers the overlay horizontally with an optional offset.
   * Clears any previously set horizontal position.
   *
   * @param offset Overlay offset from the horizontal center.
   */
  centerHorizontally(offset: string = ''): this {
    this.left(offset);
    this._justifyContent = 'center';
    return this;
  }

  /**
   * Centers the overlay vertically with an optional offset.
   * Clears any previously set vertical position.
   *
   * @param offset Overlay offset from the vertical center.
   */
  centerVertically(offset: string = ''): this {
    this.top(offset);
    this._alignItems = 'center';
    return this;
  }

  /**
   * setup the position style.
   * 
   */
  setup() {
    const style: CSSProperties = {};
    const parentStyle: CSSProperties = {};

    let width = '';
    let height = '';
    let maxWidth = '';
    let maxHeight = '';
    const shouldBeFlushHorizontally = (width === '100%' || width === '100vw') &&
                                      (!maxWidth || maxWidth === '100%' || maxWidth === '100vw');
    const shouldBeFlushVertically = (height === '100%' || height === '100vh') &&
                                    (!maxHeight || maxHeight === '100%' || maxHeight === '100vh');

    style.position = this._cssPosition;
    style.marginLeft = shouldBeFlushHorizontally ? '0' : this._leftOffset;
    style.marginTop = shouldBeFlushVertically ? '0' : this._topOffset;
    style.marginBottom = this._bottomOffset;
    style.marginRight = this._rightOffset;

    if (shouldBeFlushHorizontally) {
      parentStyle.justifyContent = 'flex-start';
    } else if (this._justifyContent === 'center') {
      parentStyle.justifyContent = 'center';
    } else {
      parentStyle.justifyContent = this._justifyContent;
    }

    parentStyle.alignItems = shouldBeFlushVertically ? 'flex-start' : this._alignItems;

    return {
      style,
      parentStyle,
    };
  }
}