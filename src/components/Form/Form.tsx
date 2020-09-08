import { defineComponent, InjectionKey, inject, renderSlot, render } from "vue";
import FormService, { Model } from "./FormService";
import { FormItemService } from "./FormItemService";

export const FormItem = defineComponent(function (props: {
  name: string;
  token?: string | null;
}) {
  const formItemService = FormItemService.getFormItem(props.name, props.token);
  return () => (
    <div>
      <input
        value={formItemService.model.value}
        onInput={(e: any) => (formItemService.model.value = e.target.value)}
      ></input>
    </div>
  );
});
FormItem.props = {
  name: {
    default: "",
    type: String,
  },
  token: {
    default: null,
    type: String,
  },
};

export const Form = defineComponent(function (
  props: { token: string | null },
  { slots }
) {
  const formItem = inject(props.token || FormService.token);
  return () => <div>{renderSlot(slots, "default")}</div>;
});

Form.props = {
  token: {
    default: null,
    type: String,
  },
};
