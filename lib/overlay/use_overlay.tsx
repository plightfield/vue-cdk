import { Teleport, defineComponent, SetupContext, renderSlot, ref } from 'vue';
import { PositionStrategy } from './position/position_strategy';

export const useOverlay = (strategy: PositionStrategy, backdropClose: boolean) => {
  const show = ref(false);
  const styles = strategy.setup();
  const originDisplay = styles.containerStyle.display;
  const overlay = defineComponent({
    setup(_, ctx: SetupContext) {
      const innerShow = ref(false);
      const click = () => {
        if (backdropClose) {
          show.value = false;
        }
      };

      return () => {
        const containerStyle = { ...styles.containerStyle };
        const positionedStyle = { ...styles.positionedStyle.value };
        containerStyle.display = show.value ? originDisplay : 'none';
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
    }
  });
  return {
    attach() {
      show.value = true;
    },
    detach() {
      show.value = false;
    },
    overlay,
  }
}
