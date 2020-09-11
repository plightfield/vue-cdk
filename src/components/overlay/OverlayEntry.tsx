import {Teleport, defineComponent, CSSProperties, SetupContext, renderSlot, watchEffect } from 'vue';

export class OverlayEntry {
  show: boolean = false;

  constructor(private builder: () => ReturnType<typeof defineComponent>) {
  }

  attach() {

  }

  detach() {

  }

  render() {
    const componentRef = new (this.builder())();
    return defineComponent((_, ctx: SetupContext) => {
      const click = () => {
        // const closed = ;
        // default is true   
        // const enabled = closed === undefined ? true : closed;
        // if (enabled) {
          ctx.emit('showChanged', false);
        // }
      };

      watchEffect(() => {
        
      });
    
      return () => {
        const containerStyle: CSSProperties = {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.4)',
          display: this.show ? 'block' : 'none',
        };
        const positionedStyle:CSSProperties = {
          position: 'relative',
          top: '50%',
          left: '50%',
          transition: 'transfrom(-50%, -50%)',
        };
        return (
          <Teleport to="#vue-cdk-overlay">
            <div style={containerStyle} onClick={click}>
              <div style={positionedStyle}>
                {componentRef}
              </div>
            </div>
          </Teleport>
        );
      }
    });
  }
}
