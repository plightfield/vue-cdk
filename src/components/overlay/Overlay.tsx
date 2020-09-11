import {Teleport, defineComponent, CSSProperties, SetupContext, renderSlot } from 'vue';

interface OverlayProps {
  show: boolean;
  onUpdateShow: (value: boolean) => void;
  backdropClose?: boolean;
  beforeShow?: () => Promise<void>;
  afterShow?: () => Promise<void>;
}

const Overlay = defineComponent((props: OverlayProps, ctx: SetupContext) => {
  const click = () => {
    const closed = props.backdropClose;
    // default is true   
    const enabled = closed === undefined ? true : closed;
    if (enabled) {
      ctx.emit('updateShow', false);
    }
  }

  return () => {
    const containerStyle: CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.4)',
      display: props.show ? 'block' : 'none',
    };
    const positionedStyle:CSSProperties = {
      position: 'relative'
    };
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
});

Overlay.props = ['show', 'onUpdateShow', 'backdropClose', 'beforeShow', 'afterShow'];

export default Overlay;