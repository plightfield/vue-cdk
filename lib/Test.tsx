import { defineComponent, renderSlot, watchEffect, watch } from 'vue'
import FormModelService from './form/FormModelService'
import FormInputService from './form/FormInputService'

const Input = defineComponent(function(props: { name: string }, ctx) {
  const formInput = new FormInputService(props.name)
  formInput.validateOn = 'blur'
  return () => (
    <div>
      <input
        value={formInput.data}
        onInput={(e: any) => {
          formInput.data = e.target.value
        }}
        onBlur={() => formInput.blur()}
        onFocus={() => formInput.focus()}
      ></input>
      {renderSlot(ctx.slots, 'default')}
    </div>
  )
})
Input.props = ['name']

const FormItem = defineComponent(function(props: { name: string }, ctx) {
  new FormInputService(props.name)
  return () => renderSlot(ctx.slots, 'default')
})
FormItem.props = ['name']

const Test = defineComponent(function() {
  const formModel = new FormModelService({ test: 1111, child: ['fuck'] })
  formModel.setRules({
    test: [{ required: true }],
    child: {
      type: 'array',
      fields: {
        0: [{ required: true }],
      },
    },
  })
  return () => (
    <div>
      <Input name="test"></Input>
      <FormItem name="child">
        <Input name="0"></Input>
      </FormItem>
    </div>
  )
})
Test.displayName = 'test-component'

export default Test
