import { coerceCssPixelToNumber, coerceCssPixelValue } from '../coercion/coerce_css_pixel_value';
import { defineComponent, ref, SetupContext, Teleport, renderSlot, DefineComponent, onMounted, watch, reactive, ComponentInternalInstance, watchEffect } from "vue";
import { OverlayProps } from './overlay_props';
import { PositionStrategy } from "./position/position_strategy";

export class OverlayState {
  public readonly overlay: ReturnType<typeof defineComponent>;
  private show = ref(false);
  constructor(
    private strategy: PositionStrategy,
    private backdropClose: boolean,
  ) {
    this.overlay = this.render();
  }

  attach() {
    this.show.value = true;
  }

  detach() {
    this.show.value = false;
  }

  render(): DefineComponent {
    const that = this;
    return defineComponent({
      setup(props, ctx: SetupContext) {
        const click = (event: Event) => {
          event.preventDefault();
          if (that.backdropClose) {
            that.show.value = false;
          }
        };
        const styles = reactive<OverlayProps>({ containerStyle: {}, positionedStyle: {} });
        const originDisplay = ref('');

        onMounted(() => {
          const current = that.strategy.setup();
          styles.containerStyle = current.containerStyle;
          styles.positionedStyle = current.positionedStyle;
          originDisplay.value = styles.containerStyle.display!;
          styles.containerStyle.display = 'none';
        });

        watch(that.show, (value) => {
          styles.containerStyle.display = value ? originDisplay.value : 'none';
        });


        // const checkScrollSpeed = (function (settings?: { delay: number }) {
        //   let lastPos: number;
        //   let newPos: number;
        //   let timer: number;
        //   let delta: number;
        //   let delay = settings?.delay || 16;

        //   function clear() {
        //     lastPos = 0;
        //     delta = 0;
        //   }

        //   clear();

        //   return (event: Event) => {
        //     newPos = document.body.scrollTop;
        //     if (lastPos != null) { // && newPos < maxScroll 
        //       delta = newPos - lastPos;
        //     }
        //     lastPos = newPos;
        //     clearTimeout(timer);
        //     timer = setTimeout(clear, delay);

        //     let value = coerceCssPixelToNumber(styles.positionedStyle.top);
        //     value += delta;
        //     styles.positionedStyle.top = coerceCssPixelValue(value);
        //   };
        // })();



        return () => {
          return (
            <Teleport to="#vue-cdk-overlay">
              <div style={styles.containerStyle} onClick={click}>
                <div style={styles.positionedStyle} onClick={event => event.cancelBubble = true}>
                  {renderSlot(ctx.slots, 'default')}
                </div>
              </div>
            </Teleport>
          );
        }
      }
    });
  }
}