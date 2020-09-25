import { defineComponent, h } from "vue";
import { Table, TableContentSlots, TableHeaderSlots } from './table';
import { CdkRow } from './row';
import { CdkColumnDef } from './directives';
interface ChemisticElement {
  position: number;
  name: string;
  symbol: string;
}

export default defineComponent({
  name: 'cdk-table-spec',
  directives: {
    // 'cdk-cell': CdkCell,
    // 'cdk-header-cell': CdkHeaderCell,
    'cdk-column-def': CdkColumnDef,
  },
  setup() {
    const dataSource: ChemisticElement[] = [
      { name: 'Hydrogen', position: 1, symbol: 'H' },
      { name: 'Helium', position: 2, symbol: 'He' },
      { name: 'Lithium', position: 3, symbol: 'Li' },
    ];
    const headerSlots: TableHeaderSlots = (value: string) => (
      <th>{value}</th>
    );

    const contentSlots: TableContentSlots<ChemisticElement> = {
      name: (value) => (<td style="text-align: center;">{value}</td>),
      position: (value) => (<td style="text-align: center;">{value}</td>),
      symbol: (value) => (<td style="text-align: center;">{value}</td>)
    };

    // 用法
    const nameRow = () => (<tr v-cdk-row={['name']} style="background: green;"></tr>)
    const row = () => (<tr v-cdk-row={['position', 'symbol']} style="background: green;"></tr>)

    // 渲染结果
    // <tr style="background: green;"> hello </tr>

    const table = new Table<ChemisticElement>({
      headerRow: ['position', 'name', 'symbol'],
      dataSource: dataSource,
      headerSlots,
      contentSlots,
      
    });
    const CdkTable = table.element;

    return () => (
      <CdkTable style="width: 300px; height: 300px;" />
    );
  }
});
