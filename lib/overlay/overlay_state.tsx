import { coerceCssPixelToNumber, coerceCssPixelValue } from '../coercion/coerce_css_pixel_value';
import { defineComponent, ref, SetupContext, Teleport, renderSlot, DefineComponent, onMounted, watch, reactive, ComponentInternalInstance, watchEffect, CSSProperties, shallowReactive, onUnmounted } from "vue";
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
        const styles = reactive<{ containerStyle: CSSProperties, positionedStyle: CSSProperties }>({ containerStyle: {}, positionedStyle: {} });
        const originDisplay = ref('');

        onMounted(() => {
          const current = that.strategy.setup();
          watch(current.positionedStyle, (value) => {
            styles.positionedStyle = current.positionedStyle.value;
          });
          styles.containerStyle = current.containerStyle;
          styles.positionedStyle = current.positionedStyle.value;
          originDisplay.value = styles.containerStyle.display!;
          styles.containerStyle.display = 'none';
        });

        onUnmounted(() => {
          that.strategy.dispose();
        });

        watch(that.show, (value) => {
          styles.containerStyle.display = value ? originDisplay.value : 'none';
        });

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