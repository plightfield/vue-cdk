import { CSSProperties, DefineComponent, defineComponent, onMounted, ref, renderSlot, SetupContext } from "vue";
export interface CdkTableBaseProps {
  class?: string | string[];
  style?: CSSProperties | string;
}

export interface CdkRowProps extends CdkTableBaseProps {

}

export interface CdkHeaderRowProps extends CdkTableBaseProps {
  columns: string[];
}

export const CdkRow = (props: CdkRowProps, ctx: SetupContext) => {
  const state = new CdkRowState();
  const Row = state.render();
  return (<Row style={props.style} class={props.class} v-slots={ctx.slots}/>);
}

export class CdkRowState {  
  render() {
    return defineComponent({
      name: 'cdk-row',
      props: ['style', 'class'],
      setup(props, ctx) {

        const slotRefs = ref();
        onMounted(() => {
          console.log(slotRefs.value.el);
        })

        return () => (
          <tr style={props.style} class={props.class}>
            {slotRefs.value = renderSlot(ctx.slots, 'default')}
          </tr>
        );
      }
    });
  }
}

export const CdkHeaderRow = (props: CdkHeaderRowProps, ctx: SetupContext) => {
  const state = new CdkHeaderRowState(props.columns);
  const Row = state.render();
  return (<Row style={props.style} class={props.class} v-slots={ctx.slots}/>);
}

export class CdkHeaderRowState {
  constructor(private readonly columns: string[]) {

  }

  render() {
    const that = this;
    return defineComponent({
      name: 'cdk-header-row',
      props: ['style', 'class'],
      setup(props, ctx) {
        const slotRefs = ref();
        onMounted(() => {
          console.log(slotRefs.value.el);
        })
        return () => (
          <tr style={props.style} class={props.class}>
            {slotRefs.value = renderSlot(ctx.slots, 'default')}
          </tr>
        );
      }
    });
  }
}