import { defineComponent } from "vue";
import {CdkTable} from './table';

export default defineComponent({
  name: 'cdk-table-spec',
  setup() {
    return () => (
      <CdkTable></CdkTable>
    )
  }
});
