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
  onUnmounted,
} from "vue";
import { OverlayConfig } from '.';
import './overlay_state.css';

export class OverlayState {
  public readonly element: DefineComponent;

  private readonly show = ref(false);

  private readonly originOverflow = this.body.style.overflow;

  constructor(
    private readonly config: Required<OverlayConfig>,
    private body: HTMLElement,
  ) {
    this.element = this.render();
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
      name: 'cdk-overlay',
      setup(props, ctx: SetupContext) {
        const click = (event: Event) => {
          event.preventDefault();

          that.config.backdropClick?.();
          if (that.config.backdropClose ?? true) {
            that.detach();
          }
        };
        const containerClass = that._getContainerClass();
        const styles = reactive<{ containerStyle: CSSProperties, positionedStyle: CSSProperties }>({
          containerStyle: {},
          positionedStyle: {}
        });
        let originDisplay = '';

        onMounted(() => {
          const current = that.config.strategy.setup();
          styles.containerStyle = current.containerStyle;
          styles.positionedStyle = current.positionedStyle.value;

          originDisplay = styles.containerStyle.display!;
          styles.containerStyle.display = 'none';
          styles.containerStyle.pointerEvents = that.config.hasBackdrop ? 'auto' : 'none';

          watch(current.positionedStyle, (value) => {
            styles.positionedStyle = value;
          });
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

        return () => (
          <Teleport to="#vue-cdk-overlay">
            <div style={styles.containerStyle} class={containerClass} onClick={click}>
              <div style={styles.positionedStyle} onClick={event => event.cancelBubble = true}>
                {renderSlot(ctx.slots, 'default')}
              </div>
            </div>
          </Teleport>
        );
      }
    });
  }

  _setOverflow(enable: boolean) {
    if (this.config.backgroundBlock) {
      this.body.style.overflow = enable ? 'hidden' : this.originOverflow;
    }
  }

  _getContainerClass() {
    let bgClasses = 'overlay_container_background ';
    const backgroundClass = this.config.backgroundClass;
    if (!backgroundClass) {
      return bgClasses;
    }
    if (Array.isArray(backgroundClass)) {
      return bgClasses + backgroundClass.join(' ');
    } else {
      return bgClasses + backgroundClass;
    }
  }
}