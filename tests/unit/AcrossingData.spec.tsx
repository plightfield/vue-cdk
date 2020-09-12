// !!Vue3 now don't have many way to test
// !!use example to avoid
import { defineComponent, InjectionKey, renderSlot, isRef, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { AccrossingDataRoot, AccrossingData } from '../../lib/core/PassingData'
import { indexOf } from 'lodash'

interface DataType {
  test: string
  name: string
}
const dataToken: InjectionKey<DataType> = Symbol()

const TestRoot = defineComponent(function(_, ctx) {
  const root = new AccrossingDataRoot<DataType>(
    { test: '', name: 'shit' },
    dataToken
  )
  return () => (
    <div>
      <input id="testRoot" value={root.model.value.name} />
      {renderSlot(ctx.slots, 'default')}
    </div>
  )
})

const TestChild = defineComponent(function(props: { name: string }, ctx) {
  const child = new AccrossingData<DataType>(props.name, dataToken)
  return () => (
    <div>
      <input
        class={props.name === 'test' ? '' : 'testChild'}
        value={child.model}
        onInput={(e: any) => (child.model = e.target.value)}
      />
      {renderSlot(ctx.slots, 'default')}
    </div>
  )
})
TestChild.props = ['name']

const Test = defineComponent(function() {
  return () => (
    <TestRoot>
      {() => (
        <>
          <TestChild name="test"></TestChild>
          <TestChild name="name"></TestChild>
        </>
      )}
    </TestRoot>
  )
})

let instance: any
beforeEach(() => {
  instance = mount(Test)
})

// it("will get all data", () => {
//   console.log(instance.find("#testRoot").element.value);
//   expect(instance.find("#testRoot").element.value).toBe("shit");
//   expect(instance.find(TestChild).find(".testChild").element.vlaue).toBe(
//     "shit"
//   );
// });

// it("root will have the right data", () => {
//   expect(isRef(root.model)).toBeTruthy();
//   expect(root.model.value.test).toBe("");
//   expect(root.model.value.name).toBe("shit");
// });

// it("children will get the right data", () => {
//   expect(child1.root.model.value.name).toBe("shit");
//   expect(child2.root.model.value.name).toBe("shit");
// });

// it(`children's model can be get`, () => {
//   let res = "";
//   for (let item of children) {
//     if (item.key === "name") {
//       res = item.model;
//     }
//   }
//   expect(res).toBe("shit");
// });

// it(`children's model can be set`, async () => {
//   for (let item of children) {
//     if (item.key === "name") {
//       item.model = "fuck";
//     }
//   }
//   await nextTick();
//   expect(root.model.value.name).toBe("fuck");
// });
