// import { PositionStrategy } from "./position_strategy";
// import { OverlayProps } from "../overlay_props";
// import {coerceCssPixelValue, coerceArray} from '../../coercion';

// export type FlexibleConnectedPositionStrategyOrigin = Element | Point & {
//     width?: number;
//     height?: number;
// };

// export class FlexiblePositionStrategy implements PositionStrategy {

//     /** Last size used for the bounding box. Used to avoid resizing the overlay after open. */
//     private _lastBoundingBoxSize = { width: 0, height: 0 };

//     /** Whether the overlay was pushed in a previous positioning. */
//     private _isPushed = false;

//     /** Whether the overlay can be pushed on-screen on the initial open. */
//     private _canPush = true;

//     /** Whether the overlay can grow via flexible width/height after the initial open. */
//     private _growAfterOpen = false;

//     /** Whether the overlay's width and height can be constrained to fit within the viewport. */
//     private _hasFlexibleDimensions = true;

//     /** Whether the overlay position is locked. */
//     private _positionLocked = false;

//     /** Cached origin dimensions */
//     private _originRect: ClientRect;

//     /** Cached overlay dimensions */
//     private _overlayRect: ClientRect;

//     /** Cached viewport dimensions */
//     private _viewportRect: ClientRect;

//     /** Amount of space that must be maintained between the overlay and the edge of the viewport. */
//     private _viewportMargin = 0;



//     /** The origin element against which the overlay will be positioned. */
//     private _origin: FlexibleConnectedPositionStrategyOrigin;

//     /** The overlay pane element. */
//     private _pane: HTMLElement;

//     /** Whether the strategy has been disposed of already. */
//     private _isDisposed: boolean;

//     /**
//      * Parent element for the overlay panel used to constrain the overlay panel's size to fit
//      * within the viewport.
//      */
//     private _boundingBox: HTMLElement | null;

//     /** The last position to have been calculated as the best fit position. */
//     private _lastPosition: ConnectedPosition | null;


//     /** Default offset for the overlay along the x axis. */
//     private _offsetX = 0;

//     /** Default offset for the overlay along the y axis. */
//     private _offsetY = 0;

//     /** Selector to be used when finding the elements on which to set the transform origin. */
//     private _transformOriginSelector: string;

//     /** Keeps track of the CSS classes that the position strategy has applied on the overlay panel. */
//     private _appliedPanelClasses: string[] = [];

//     /** Amount by which the overlay was pushed in each axis during the last time it was positioned. */
//     private _previousPushAmount: { x: number, y: number } | null;

//     private _document = window.document;
    
//     constructor(
//         connectedTo: FlexibleConnectedPositionStrategyOrigin,
//     ) {
//         this.setOrigin(connectedTo);
//     }

//     setup(): OverlayProps {

//         this._clearPanelClasses();
//         this._resetOverlayElementStyles();
//         this._resetBoundingBoxStyles();

//         // We need the bounding rects for the origin and the overlay to determine how to position
//         // the overlay relative to the origin.
//         // We use the viewport rect to determine whether a position would go off-screen.
//         this._viewportRect = this._getNarrowedViewportRect();
//         this._originRect = this._getOriginRect();
//         this._overlayRect = this._pane.getBoundingClientRect();

//         const originRect = this._originRect;
//         const overlayRect = this._overlayRect;
//         const viewportRect = this._viewportRect;

//         // Positions where the overlay will fit with flexible dimensions.
//         const flexibleFits: FlexibleFit[] = [];

//         // Fallback if none of the preferred positions fit within the viewport.
//         let fallback: FallbackPosition | undefined;

//         // Go through each of the preferred positions looking for a good fit.
//         // If a good fit is found, it will be applied immediately.
//         for (let pos of this._preferredPositions) {
//             // Get the exact (x, y) coordinate for the point-of-origin on the origin element.
//             let originPoint = this._getOriginPoint(originRect, pos);

//             // From that point-of-origin, get the exact (x, y) coordinate for the top-left corner of the
//             // overlay in this position. We use the top-left corner for calculations and later translate
//             // this into an appropriate (top, left, bottom, right) style.
//             let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);

//             // Calculate how well the overlay would fit into the viewport with this point.
//             let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);

//             // If the overlay, without any further work, fits into the viewport, use this position.
//             if (overlayFit.isCompletelyWithinViewport) {
//                 this._isPushed = false;
//                 this._applyPosition(pos, originPoint);
//                 return;
//             }

//             // If the overlay has flexible dimensions, we can use this position
//             // so long as there's enough space for the minimum dimensions.
//             if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
//                 // Save positions where the overlay will fit with flexible dimensions. We will use these
//                 // if none of the positions fit *without* flexible dimensions.
//                 flexibleFits.push({
//                     position: pos,
//                     origin: originPoint,
//                     overlayRect,
//                     boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos)
//                 });

//                 continue;
//             }

//             // If the current preferred position does not fit on the screen, remember the position
//             // if it has more visible area on-screen than we've seen and move onto the next preferred
//             // position.
//             if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) {
//                 fallback = { overlayFit, overlayPoint, originPoint, position: pos, overlayRect };
//             }
//         }

//         // If there are any positions where the overlay would fit with flexible dimensions, choose the
//         // one that has the greatest area available modified by the position's weight
//         if (flexibleFits.length) {
//             let bestFit: FlexibleFit | null = null;
//             let bestScore = -1;
//             for (const fit of flexibleFits) {
//                 const score =
//                     fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
//                 if (score > bestScore) {
//                     bestScore = score;
//                     bestFit = fit;
//                 }
//             }

//             this._isPushed = false;
//             this._applyPosition(bestFit!.position, bestFit!.origin);
//             return;
//         }

//         // When none of the preferred positions fit within the viewport, take the position
//         // that went off-screen the least and attempt to push it on-screen.
//         if (this._canPush) {
//             // TODO(jelbourn): after pushing, the opening "direction" of the overlay might not make sense.
//             this._isPushed = true;
//             this._applyPosition(fallback!.position, fallback!.originPoint);
//             return;
//         }

//         // All options for getting the overlay within the viewport have been exhausted, so go with the
//         // position that went off-screen the least.
//         this._applyPosition(fallback!.position, fallback!.originPoint);

//         return {
//             style: {},
//             parentStyle: {}
//         };
//     }


//     _getOriginRect(): ClientRect {
//         throw new Error("Method not implemented.");
//     }

//     detach(): void {
//         this._clearPanelClasses();
//         this._lastPosition = null;
//         this._previousPushAmount = null;
//     }


//     /**
//      * Sets a minimum distance the overlay may be positioned to the edge of the viewport.
//      * @param margin Required margin between the overlay and the viewport edge in pixels.
//      */
//     withViewportMargin(margin: number): this {
//         this._viewportMargin = margin;
//         return this;
//     }

//     /** Sets whether the overlay's width and height can be constrained to fit within the viewport. */
//     withFlexibleDimensions(flexibleDimensions = true): this {
//         this._hasFlexibleDimensions = flexibleDimensions;
//         return this;
//     }

//     /** Sets whether the overlay can grow after the initial open via flexible width/height. */
//     withGrowAfterOpen(growAfterOpen = true): this {
//         this._growAfterOpen = growAfterOpen;
//         return this;
//     }

//     /** Sets whether the overlay can be pushed on-screen if none of the provided positions fit. */
//     withPush(canPush = true): this {
//         this._canPush = canPush;
//         return this;
//     }

//     /**
//      * Sets whether the overlay's position should be locked in after it is positioned
//      * initially. When an overlay is locked in, it won't attempt to reposition itself
//      * when the position is re-applied (e.g. when the user scrolls away).
//      * @param isLocked Whether the overlay should locked in.
//      */
//     withLockedPosition(isLocked = true): this {
//         this._positionLocked = isLocked;
//         return this;
//     }

//     /**
//      * Sets the origin, relative to which to position the overlay.
//      * Using an element origin is useful for building components that need to be positioned
//      * relatively to a trigger (e.g. dropdown menus or tooltips), whereas using a point can be
//      * used for cases like contextual menus which open relative to the user's pointer.
//      * @param origin Reference to the new origin.
//      */
//     setOrigin(origin: FlexibleConnectedPositionStrategyOrigin): this {
//         this._origin = origin;
//         return this;
//     }

//     /**
//      * Sets the default offset for the overlay's connection point on the x-axis.
//      * @param offset New offset in the X axis.
//      */
//     withDefaultOffsetX(offset: number): this {
//         this._offsetX = offset;
//         return this;
//     }

//     /**
//      * Sets the default offset for the overlay's connection point on the y-axis.
//      * @param offset New offset in the Y axis.
//      */
//     withDefaultOffsetY(offset: number): this {
//         this._offsetY = offset;
//         return this;
//     }

//     /**
//      * Configures that the position strategy should set a `transform-origin` on some elements
//      * inside the overlay, depending on the current position that is being applied. This is
//      * useful for the cases where the origin of an animation can change depending on the
//      * alignment of the overlay.
//      * @param selector CSS selector that will be used to find the target
//      *    elements onto which to set the transform origin.
//      */
//     withTransformOriginOn(selector: string): this {
//         this._transformOriginSelector = selector;
//         return this;
//     }

//     /**
//      * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
//      */
//     private _getOriginPoint(originRect: ClientRect, pos: ConnectedPosition): Point {
//         let x: number;
//         if (pos.originX == 'center') {
//             // Note: when centering we should always use the `left`
//             // offset, otherwise the position will be wrong in RTL.
//             x = originRect.left + (originRect.width / 2);
//         } else {
//             const startX = originRect.left;
//             const endX = originRect.right;
//             x = pos.originX == 'start' ? startX : endX;
//         }

//         let y: number;
//         if (pos.originY == 'center') {
//             y = originRect.top + (originRect.height / 2);
//         } else {
//             y = pos.originY == 'top' ? originRect.top : originRect.bottom;
//         }

//         return { x, y };
//     }


//     /**
//      * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
//      * origin point to which the overlay should be connected.
//      */
//     private _getOverlayPoint(
//         originPoint: Point,
//         overlayRect: ClientRect,
//         pos: ConnectedPosition): Point {

//         // Calculate the (overlayStartX, overlayStartY), the start of the
//         // potential overlay position relative to the origin point.
//         let overlayStartX: number;
//         if (pos.overlayX == 'center') {
//             overlayStartX = -overlayRect.width / 2;
//         } else if (pos.overlayX === 'start') {
//             overlayStartX = 0;
//         } else {
//             overlayStartX = -overlayRect.width;
//         }

//         let overlayStartY: number;
//         if (pos.overlayY == 'center') {
//             overlayStartY = -overlayRect.height / 2;
//         } else {
//             overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
//         }

//         // The (x, y) coordinates of the overlay.
//         return {
//             x: originPoint.x + overlayStartX,
//             y: originPoint.y + overlayStartY,
//         };
//     }

//     /** Gets how well an overlay at the given point will fit within the viewport. */
//     private _getOverlayFit(point: Point, overlay: ClientRect, viewport: ClientRect,
//         position: ConnectedPosition): OverlayFit {

//         let { x, y } = point;
//         let offsetX = this._getOffset(position, 'x');
//         let offsetY = this._getOffset(position, 'y');

//         // Account for the offsets since they could push the overlay out of the viewport.
//         if (offsetX) {
//             x += offsetX;
//         }

//         if (offsetY) {
//             y += offsetY;
//         }

//         // How much the overlay would overflow at this position, on each side.
//         let leftOverflow = 0 - x;
//         let rightOverflow = (x + overlay.width) - viewport.width;
//         let topOverflow = 0 - y;
//         let bottomOverflow = (y + overlay.height) - viewport.height;

//         // Visible parts of the element on each axis.
//         let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
//         let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
//         let visibleArea = visibleWidth * visibleHeight;

//         return {
//             visibleArea,
//             isCompletelyWithinViewport: (overlay.width * overlay.height) === visibleArea,
//             fitsInViewportVertically: visibleHeight === overlay.height,
//             fitsInViewportHorizontally: visibleWidth == overlay.width,
//         };
//     }

//     /**
//      * Whether the overlay can fit within the viewport when it may resize either its width or height.
//      * @param fit How well the overlay fits in the viewport at some position.
//      * @param point The (x, y) coordinates of the overlat at some position.
//      * @param viewport The geometry of the viewport.
//      */
//     private _canFitWithFlexibleDimensions(fit: OverlayFit, point: Point, viewport: ClientRect) {
//         if (this._hasFlexibleDimensions) {
//             const availableHeight = viewport.bottom - point.y;
//             const availableWidth = viewport.right - point.x;
//             const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
//             const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);

//             const verticalFit = fit.fitsInViewportVertically ||
//                 (minHeight != null && minHeight <= availableHeight);
//             const horizontalFit = fit.fitsInViewportHorizontally ||
//                 (minWidth != null && minWidth <= availableWidth);

//             return verticalFit && horizontalFit;
//         }
//         return false;
//     }



//     /**
//      * Applies a computed position to the overlay and emits a position change.
//      * @param position The position preference
//      * @param originPoint The point on the origin element where the overlay is connected.
//      */
//     private _applyPosition(position: ConnectedPosition, originPoint: Point) {
//         this._setTransformOrigin(position);
//         this._setOverlayElementStyles(originPoint, position);
//         this._setBoundingBoxStyles(originPoint, position);

//         if (position.panelClass) {
//             this._addPanelClasses(position.panelClass);
//         }

//         // Save the last connected position in case the position needs to be re-calculated.
//         this._lastPosition = position;
//     }

//     /** Sets the transform origin based on the configured selector and the passed-in position.  */
//     private _setTransformOrigin(position: ConnectedPosition) {
//         if (!this._transformOriginSelector) {
//             return;
//         }

//         const elements: NodeListOf<HTMLElement> =
//             this._boundingBox!.querySelectorAll(this._transformOriginSelector);
//         let xOrigin: 'left' | 'right' | 'center';
//         let yOrigin: 'top' | 'bottom' | 'center' = position.overlayY;

//         if (position.overlayX === 'center') {
//             xOrigin = 'center';
//         } else {
//             xOrigin = position.overlayX === 'start' ? 'left' : 'right';
//         }

//         for (let i = 0; i < elements.length; i++) {
//             elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
//         }
//     }

//     /**
//      * Gets the position and size of the overlay's sizing container.
//      *
//      * This method does no measuring and applies no styles so that we can cheaply compute the
//      * bounds for all positions and choose the best fit based on these results.
//      */
//     private _calculateBoundingBoxRect(origin: Point, position: ConnectedPosition): BoundingBoxRect {
//         const viewport = this._viewportRect;
//         let height: number, top: number, bottom: number;

//         if (position.overlayY === 'top') {
//             // Overlay is opening "downward" and thus is bound by the bottom viewport edge.
//             top = origin.y;
//             height = viewport.height - top + this._viewportMargin;
//         } else if (position.overlayY === 'bottom') {
//             // Overlay is opening "upward" and thus is bound by the top viewport edge. We need to add
//             // the viewport margin back in, because the viewport rect is narrowed down to remove the
//             // margin, whereas the `origin` position is calculated based on its `ClientRect`.
//             bottom = viewport.height - origin.y + this._viewportMargin * 2;
//             height = viewport.height - bottom + this._viewportMargin;
//         } else {
//             // If neither top nor bottom, it means that the overlay is vertically centered on the
//             // origin point. Note that we want the position relative to the viewport, rather than
//             // the page, which is why we don't use something like `viewport.bottom - origin.y` and
//             // `origin.y - viewport.top`.
//             const smallestDistanceToViewportEdge =
//                 Math.min(viewport.bottom - origin.y + viewport.top, origin.y);

//             const previousHeight = this._lastBoundingBoxSize.height;

//             height = smallestDistanceToViewportEdge * 2;
//             top = origin.y - smallestDistanceToViewportEdge;

//             if (height > previousHeight && !this._growAfterOpen) {
//                 top = origin.y - (previousHeight / 2);
//             }
//         }

//         // The overlay is opening 'right-ward' (the content flows to the right).
//         const isBoundedByRightViewportEdge =
//             (position.overlayX === 'start') ||
//             (position.overlayX === 'end');

//         // The overlay is opening 'left-ward' (the content flows to the left).
//         const isBoundedByLeftViewportEdge =
//             (position.overlayX === 'end') ||
//             (position.overlayX === 'start');

//         let width: number, left: number, right: number;

//         if (isBoundedByLeftViewportEdge) {
//             right = viewport.width - origin.x + this._viewportMargin;
//             width = origin.x - this._viewportMargin;
//         } else if (isBoundedByRightViewportEdge) {
//             left = origin.x;
//             width = viewport.right - origin.x;
//         } else {
//             // If neither start nor end, it means that the overlay is horizontally centered on the
//             // origin point. Note that we want the position relative to the viewport, rather than
//             // the page, which is why we don't use something like `viewport.right - origin.x` and
//             // `origin.x - viewport.left`.
//             const smallestDistanceToViewportEdge =
//                 Math.min(viewport.right - origin.x + viewport.left, origin.x);
//             const previousWidth = this._lastBoundingBoxSize.width;

//             width = smallestDistanceToViewportEdge * 2;
//             left = origin.x - smallestDistanceToViewportEdge;

//             if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) {
//                 left = origin.x - (previousWidth / 2);
//             }
//         }

//         return { top: top!, left: left!, bottom: bottom!, right: right!, width, height };
//     }

//     /**
//      * Sets the position and size of the overlay's sizing wrapper. The wrapper is positioned on the
//      * origin's connection point and stetches to the bounds of the viewport.
//      *
//      * @param origin The point on the origin element where the overlay is connected.
//      * @param position The position preference
//      */
//     private _setBoundingBoxStyles(origin: Point, position: ConnectedPosition): void {
//         const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);

//         // It's weird if the overlay *grows* while scrolling, so we take the last size into account
//         // when applying a new size.
//         if (!this._isInitialRender && !this._growAfterOpen) {
//             boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
//             boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
//         }

//         const styles = {} as CSSStyleDeclaration;

//         if (this._hasExactPosition()) {
//             styles.top = styles.left = '0';
//             styles.bottom = styles.right = styles.maxHeight = styles.maxWidth = '';
//             styles.width = styles.height = '100%';
//         } else {
//             const maxHeight = this._overlayRef.getConfig().maxHeight;
//             const maxWidth = this._overlayRef.getConfig().maxWidth;

//             styles.height = coerceCssPixelValue(boundingBoxRect.height);
//             styles.top = coerceCssPixelValue(boundingBoxRect.top);
//             styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom);
//             styles.width = coerceCssPixelValue(boundingBoxRect.width);
//             styles.left = coerceCssPixelValue(boundingBoxRect.left);
//             styles.right = coerceCssPixelValue(boundingBoxRect.right);

//             // Push the pane content towards the proper direction.
//             if (position.overlayX === 'center') {
//                 styles.alignItems = 'center';
//             } else {
//                 styles.alignItems = position.overlayX === 'end' ? 'flex-end' : 'flex-start';
//             }

//             if (position.overlayY === 'center') {
//                 styles.justifyContent = 'center';
//             } else {
//                 styles.justifyContent = position.overlayY === 'bottom' ? 'flex-end' : 'flex-start';
//             }

//             if (maxHeight) {
//                 styles.maxHeight = coerceCssPixelValue(maxHeight);
//             }

//             if (maxWidth) {
//                 styles.maxWidth = coerceCssPixelValue(maxWidth);
//             }
//         }

//         this._lastBoundingBoxSize = boundingBoxRect;

//         extendStyles(this._boundingBox!.style, styles);
//     }

//     /** Resets the styles for the bounding box so that a new positioning can be computed. */
//     private _resetBoundingBoxStyles() {
//         extendStyles(this._boundingBox!.style, {
//             top: '0',
//             left: '0',
//             right: '0',
//             bottom: '0',
//             height: '',
//             width: '',
//             alignItems: '',
//             justifyContent: '',
//         } as CSSStyleDeclaration);
//     }

//     /** Resets the styles for the overlay pane so that a new positioning can be computed. */
//     private _resetOverlayElementStyles() {
//         extendStyles(this._pane.style, {
//             top: '',
//             left: '',
//             bottom: '',
//             right: '',
//             position: '',
//             transform: '',
//         } as CSSStyleDeclaration);
//     }

//     /** Sets positioning styles to the overlay element. */
//     private _setOverlayElementStyles(originPoint: Point, position: ConnectedPosition): void {
//         const styles = {} as CSSStyleDeclaration;
//         const hasExactPosition = this._hasExactPosition();
//         const hasFlexibleDimensions = this._hasFlexibleDimensions;
//         const config = this._overlayRef.getConfig();

//         if (hasExactPosition) {
//             const scrollPosition = this._viewportRuler.getViewportScrollPosition();
//             extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
//             extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
//         } else {
//             styles.position = 'static';
//         }

//         // Use a transform to apply the offsets. We do this because the `center` positions rely on
//         // being in the normal flex flow and setting a `top` / `left` at all will completely throw
//         // off the position. We also can't use margins, because they won't have an effect in some
//         // cases where the element doesn't have anything to "push off of". Finally, this works
//         // better both with flexible and non-flexible positioning.
//         let transformString = '';
//         let offsetX = this._getOffset(position, 'x');
//         let offsetY = this._getOffset(position, 'y');

//         if (offsetX) {
//             transformString += `translateX(${offsetX}px) `;
//         }

//         if (offsetY) {
//             transformString += `translateY(${offsetY}px)`;
//         }

//         styles.transform = transformString.trim();

//         // If a maxWidth or maxHeight is specified on the overlay, we remove them. We do this because
//         // we need these values to both be set to "100%" for the automatic flexible sizing to work.
//         // The maxHeight and maxWidth are set on the boundingBox in order to enforce the constraint.
//         // Note that this doesn't apply when we have an exact position, in which case we do want to
//         // apply them because they'll be cleared from the bounding box.
//         if (config.maxHeight) {
//             if (hasExactPosition) {
//                 styles.maxHeight = coerceCssPixelValue(config.maxHeight);
//             } else if (hasFlexibleDimensions) {
//                 styles.maxHeight = '';
//             }
//         }

//         if (config.maxWidth) {
//             if (hasExactPosition) {
//                 styles.maxWidth = coerceCssPixelValue(config.maxWidth);
//             } else if (hasFlexibleDimensions) {
//                 styles.maxWidth = '';
//             }
//         }

//         extendStyles(this._pane.style, styles);
//     }

//     /** Gets the exact top/bottom for the overlay when not using flexible sizing or when pushing. */
//     private _getExactOverlayY(position: ConnectedPosition,
//         originPoint: Point,
//         scrollPosition: ViewportScrollPosition) {
//         // Reset any existing styles. This is necessary in case the
//         // preferred position has changed since the last `apply`.
//         let styles = { top: '', bottom: '' } as CSSStyleDeclaration;
//         let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);

//         if (this._isPushed) {
//             overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
//         }

//         let virtualKeyboardOffset =
//             this._overlayContainer.getContainerElement().getBoundingClientRect().top;

//         // Normally this would be zero, however when the overlay is attached to an input (e.g. in an
//         // autocomplete), mobile browsers will shift everything in order to put the input in the middle
//         // of the screen and to make space for the virtual keyboard. We need to account for this offset,
//         // otherwise our positioning will be thrown off.
//         overlayPoint.y -= virtualKeyboardOffset;

//         // We want to set either `top` or `bottom` based on whether the overlay wants to appear
//         // above or below the origin and the direction in which the element will expand.
//         if (position.overlayY === 'bottom') {
//             // When using `bottom`, we adjust the y position such that it is the distance
//             // from the bottom of the viewport rather than the top.
//             const documentHeight = this._document.documentElement!.clientHeight;
//             styles.bottom = `${documentHeight - (overlayPoint.y + this._overlayRect.height)}px`;
//         } else {
//             styles.top = coerceCssPixelValue(overlayPoint.y);
//         }

//         return styles;
//     }

//     /** Gets the exact left/right for the overlay when not using flexible sizing or when pushing. */
//     private _getExactOverlayX(position: ConnectedPosition,
//         originPoint: Point,
//         scrollPosition: ViewportScrollPosition) {
//         // Reset any existing styles. This is necessary in case the preferred position has
//         // changed since the last `apply`.
//         let styles = { left: '', right: '' } as CSSStyleDeclaration;
//         let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);

//         if (this._isPushed) {
//             overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
//         }

//         // We want to set either `left` or `right` based on whether the overlay wants to appear "before"
//         // or "after" the origin, which determines the direction in which the element will expand.
//         // For the horizontal axis, the meaning of "before" and "after" change based on whether the
//         // page is in RTL or LTR.
//         const horizontalStyleProperty: 'left' | 'right' = position.overlayX === 'end' ? 'left' : 'right';

//         // When we're setting `right`, we adjust the x position such that it is the distance
//         // from the right edge of the viewport rather than the left edge.
//         if (horizontalStyleProperty === 'right') {
//             const documentWidth = this._document.documentElement!.clientWidth;
//             styles.right = `${documentWidth - (overlayPoint.x + this._overlayRect.width)}px`;
//         } else {
//             styles.left = coerceCssPixelValue(overlayPoint.x);
//         }

//         return styles;
//     }


//     /** Subtracts the amount that an element is overflowing on an axis from its length. */
//     private _subtractOverflows(length: number, ...overflows: number[]): number {
//         return overflows.reduce((currentValue: number, currentOverflow: number) => {
//             return currentValue - Math.max(currentOverflow, 0);
//         }, length);
//     }

//     /** Narrows the given viewport rect by the current _viewportMargin. */
//     private _getNarrowedViewportRect(): ClientRect {
//         // We recalculate the viewport rect here ourselves, rather than using the ViewportRuler,
//         // because we want to use the `clientWidth` and `clientHeight` as the base. The difference
//         // being that the client properties don't include the scrollbar, as opposed to `innerWidth`
//         // and `innerHeight` that do. This is necessary, because the overlay container uses
//         // 100% `width` and `height` which don't include the scrollbar either.
//         const width = this._document.documentElement!.clientWidth;
//         const height = this._document.documentElement!.clientHeight;
//         const scrollPosition = this._viewportRuler.getViewportScrollPosition();

//         return {
//             top: scrollPosition.top + this._viewportMargin,
//             left: scrollPosition.left + this._viewportMargin,
//             right: scrollPosition.left + width - this._viewportMargin,
//             bottom: scrollPosition.top + height - this._viewportMargin,
//             width: width - (2 * this._viewportMargin),
//             height: height - (2 * this._viewportMargin),
//         };
//     }

//     /** Retrieves the offset of a position along the x or y axis. */
//     private _getOffset(position: ConnectedPosition, axis: 'x' | 'y') {
//         if (axis === 'x') {
//             // We don't do something like `position['offset' + axis]` in
//             // order to avoid breking minifiers that rename properties.
//             return position.offsetX == null ? this._offsetX : position.offsetX;
//         }

//         return position.offsetY == null ? this._offsetY : position.offsetY;
//     }

//     /** Adds a single CSS class or an array of classes on the overlay panel. */
//     private _addPanelClasses(cssClasses: string | string[]) {
//         if (this._pane) {
//             coerceArray(cssClasses).forEach(cssClass => {
//                 if (cssClass !== '' && this._appliedPanelClasses.indexOf(cssClass) === -1) {
//                     this._appliedPanelClasses.push(cssClass);
//                     this._pane.classList.add(cssClass);
//                 }
//             });
//         }
//     }

//     /** Clears the classes that the position strategy has applied from the overlay panel. */
//     private _clearPanelClasses() {
//         if (this._pane) {
//             this._appliedPanelClasses.forEach(cssClass => {
//                 this._pane.classList.remove(cssClass);
//             });
//             this._appliedPanelClasses = [];
//         }
//     }
// }

// /** A simple (x, y) coordinate. */
// interface Point {
//     x: number;
//     y: number;
// }

// /** Record of measurements for how an overlay (at a given position) fits into the viewport. */
// interface OverlayFit {
//     /** Whether the overlay fits completely in the viewport. */
//     isCompletelyWithinViewport: boolean;

//     /** Whether the overlay fits in the viewport on the y-axis. */
//     fitsInViewportVertically: boolean;

//     /** Whether the overlay fits in the viewport on the x-axis. */
//     fitsInViewportHorizontally: boolean;

//     /** The total visible area (in px^2) of the overlay inside the viewport. */
//     visibleArea: number;
// }

// /** Record of the measurments determining whether an overlay will fit in a specific position. */
// interface FallbackPosition {
//     position: ConnectedPosition;
//     originPoint: Point;
//     overlayPoint: Point;
//     overlayFit: OverlayFit;
//     overlayRect: ClientRect;
// }

// /** Position and size of the overlay sizing wrapper for a specific position. */
// interface BoundingBoxRect {
//     top: number;
//     left: number;
//     bottom: number;
//     right: number;
//     height: number;
//     width: number;
// }

// /** Record of measures determining how well a given position will fit with flexible dimensions. */
// interface FlexibleFit {
//     position: ConnectedPosition;
//     origin: Point;
//     overlayRect: ClientRect;
//     boundingBoxRect: BoundingBoxRect;
// }

// /** A connected position as specified by the user. */
// export interface ConnectedPosition {
//     originX: 'start' | 'center' | 'end';
//     originY: 'top' | 'center' | 'bottom';

//     overlayX: 'start' | 'center' | 'end';
//     overlayY: 'top' | 'center' | 'bottom';

//     weight?: number;
//     offsetX?: number;
//     offsetY?: number;
//     panelClass?: string | string[];
// }

// /** Shallow-extends a stylesheet object with another stylesheet object. */
// function extendStyles(destination: CSSStyleDeclaration,
//     source: CSSStyleDeclaration): CSSStyleDeclaration {
//     for (let key in source) {
//         if (source.hasOwnProperty(key)) {
//             destination[key] = source[key];
//         }
//     }

//     return destination;
// }


// /**
// * Extracts the pixel value as a number from a value, if it's a number
// * or a CSS pixel string (e.g. `1337px`). Otherwise returns null.
// */
// function getPixelValue(input: number | string | null | undefined): number | null {
//     if (typeof input !== 'number' && input != null) {
//         const [value, units] = input.split('px');
//         return (!units || units === 'px') ? parseFloat(value) : null;
//     }

//     return (input as number) || null;
// }
