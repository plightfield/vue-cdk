import { CdkAny } from 'lib/types';
import { DefineComponent, defineComponent, h, reactive, SetupContext, shallowReactive } from "vue";

export type TableContentSlots<T> = { [key in keyof T]: (value: T[key]) => CdkAny };
export type TableHeaderSlots = (value: string) => any;

export interface CdkTableProps<T> {
  dataSource: T[],
  headerSlots: TableHeaderSlots,
  contentSlots: TableContentSlots<T>,
  footerSlots?: () => any,
  headerRows: (() => )[],
  contentRows: [],
}

export class Table<T extends object & { [key in string]: any }> {
  private readonly state: {
    dataSource: T[],
    headerRow: string[]
  };

  readonly element: DefineComponent;

  constructor(props: CdkTableProps<T>) {
    this.state = shallowReactive({
      dataSource: props.dataSource,
    }) as any;
    this.element = this.render(props.headerSlots, props.contentSlots, props.footerSlots);
  }

  render(
    headerSlots: TableHeaderSlots,
    contentSlots: TableContentSlots<T>,
    footerSlots?: () => any,
  ): DefineComponent {
    const that = this;
    return defineComponent({
      name: 'cdk-table',
      props: ['style', 'class'],
      setup(props, ctx: SetupContext) {

        const headerRow = () => {
          const slot = that.state.headerRow.map((value) => {
            return headerSlots(value)
          });
          return (<tr>{slot}</tr>);
        };
        const contentRows = () => that.state.dataSource.map((value) => {
          const slot = that.state.headerRow.map(key => contentSlots[key](value[key]));
          return (<tr>{slot}</tr>);
        });

        const footerRow = footerSlots ? () => (<tr>{footerSlots}</tr>) : undefined;

        return () => (
          <table style={props.style} class={props.class}>
            {headerRow()}
            {...contentRows()}
            {footerRow}
          </table>
        );
      }
    }) as any;
  }
}
