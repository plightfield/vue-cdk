import { CSSProperties, reactive, ref, Ref } from "vue";
import { OverlayProps } from "../overlay";
import { PositionStrategy } from "./position_strategy";



/**
 * @description
 * Global position strategy can let your overlay content 
 * fixed in a overlay wrapper dom.
 * @date 2020-09-14
 * @export
 * @class GlobalPositionStrategy
 */
export class GlobalPositionStrategy extends PositionStrategy {
  private _cssPosition: 'static' | 'absolute' | 'fixed' | 'relative' = 'static';
  private _topOffset: string = '';
  private _bottomOffset: string = '';
  private _leftOffset: string = '';
  private _rightOffset: string = '';
  private _alignItems: string = '';
  private _justifyContent: string = '';
  private _width: string = '';
  private _height: string = '';

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
   */
  width(value: string = ''): this {
    this._width = value;
    return this;
  }

  /**
   * Sets the overlay height and clears any previously set height.
   * @param value New height for the overlay
   */
  height(value: string = ''): this {
    this._height = value;
    return this;
  }

  /**
   * Centers the overlay horizontally with an optional offset.
   * Clears any previously set horizontal position.
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
   * @returns OverlayProps
   */
  setup(): OverlayProps {
    const positionedStyle = ref<CSSProperties>({
      width: this._width,
      height: this._height,
      position: this._cssPosition,
      marginLeft: this._leftOffset,
      marginRight: this._rightOffset,
      marginTop: this._topOffset,
      marginBottom: this._bottomOffset,
      pointerEvents: "auto",
    });
    // container style must set display to flex.
    const containerStyle: CSSProperties = {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      position: 'fixed',
      display: 'flex',
      justifyContent: this._justifyContent,
      alignItems: this._alignItems,
    };

    return {
      containerStyle,
      positionedStyle,
    };
  }

  dispose(): void {
  }

}