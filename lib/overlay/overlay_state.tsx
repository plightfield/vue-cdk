import { defineComponent, ref, SetupContext, Teleport, renderSlot } from "vue";
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

  render(): ReturnType<typeof defineComponent> {
    const styles = this.strategy.setup();
    const originDisplay = styles.parentStyle.display;
    return defineComponent<undefined>((_, ctx: SetupContext) => {
      const click = () => {
        if (this.backdropClose) {
          this.show.value = false;
        }
      };

      return () => {
        const containerStyle = {...styles.parentStyle};
        const positionedStyle = {...styles.style};
        containerStyle.display = this.show.value ? originDisplay : 'none';
        return (
          <Teleport to="#vue-cdk-overlay">
            <div style={containerStyle} onClick={click}>
              <div style={positionedStyle}>
                {renderSlot(ctx.slots, 'default')}
              </div>
            </div>
          </Teleport>
        );
      }
    }) as any;
  }
}