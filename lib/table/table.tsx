import { isObject } from "lodash";
import { defineComponent, Directive, renderSlot, SetupContext } from "vue";

export const CdkCell: Directive = {
  beforeMount(el: any) {
    if (!(el instanceof HTMLTableRowElement)) {
      throw Error('CdkCell directive must binding <tr> tag!');
    }
    el
  }
}

export const CdkTable = defineComponent({
  name: 'cdk-table',
  props: {
    dataSource: {
      type: Array,
      default: []
    }
  },

  setup(props, ctx: SetupContext) {

    const slotKeys = Object.keys(ctx.slots);
    
    const tableRows = props.dataSource.map((value) => {
      if (!isObject(value)) {
        throw Error('DataSource must be array of object');
      }
      return slotKeys.map(key => {
        <tr>
          {renderSlot(ctx.slots, key, {data: (value as any)[key]})}
        </tr>
      });
    });
    return () => (
      <table>
        {tableRows}
      </table>
    );
  }
})