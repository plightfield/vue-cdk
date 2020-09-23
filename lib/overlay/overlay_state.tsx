import {
  defineComponent,
  ref,
  SetupContext,
  Teleport,
  renderSlot,
  DefineComponent,
  onMounted,
  watch,
  reactive,
  CSSProperties,
  onUnmounted, Transition
} from "vue";
import { OverlayConfig } from '.';
import './overlay_state.css';

export class OverlayState {
  public readonly overlay: DefineComponent;
  private readonly show = ref(false);

  private readonly originOverflow = this.body.style.overflow;

  constructor(
    private readonly config: OverlayConfig,
    private body: HTMLElement,
  ) {
    this.overlay = this.render();
  }

  attach(): void {
    this._setOverflow(true);
    this.show.value = true;
  }

  detach(): void {
    this._setOverflow(false);
    this.show.value = false;
  }

  render(): DefineComponent {
    const that = this;
    return defineComponent({
      setup(props, ctx: SetupContext) {
        const click = (event: Event) => {
          event.preventDefault();

          that.config.backdropClick?.();
          if (that.config.backdropClose ?? true) {
            that.detach();
          }
        };
        const styles = reactive<{ containerStyle: CSSProperties, positionedStyle: CSSProperties }>({ containerStyle: {}, positionedStyle: {} });
        let originDisplay = '';

        onMounted(() => {
          const current = that.config.strategy.setup();
          watch(current.positionedStyle, (value) => {
            styles.positionedStyle = current.positionedStyle.value;
          });
          styles.containerStyle = current.containerStyle;
          styles.positionedStyle = current.positionedStyle.value;

          originDisplay = styles.containerStyle.display!;
          styles.containerStyle.display = 'none';
        });

        onUnmounted(() => {
          that.config.strategy.dispose();
        });

        watch(that.show, (value) => {
          if (value) {
            styles.containerStyle.display = originDisplay;
            that.config.strategy.attach?.();
          } else {
            styles.containerStyle.display = 'none';
            that.config.strategy.detach?.();
          }
        });

        return () => {
          return (
            <Teleport to="#vue-cdk-overlay">
              <div style={styles.containerStyle} class="overlay_container_background" onClick={click}>
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

  _setOverflow(enable: boolean) {
    if (this.config.backgroundBlock) {
      this.body.style.overflow = enable ? 'hidden' : this.originOverflow;
    }
  }
}