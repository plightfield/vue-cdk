import { SetupContext, defineComponent } from "vue";
import AbstractForm from "./AbstractForm";

export class FormGroupCompo extends AbstractForm {
  model: { [key: string]: any };
  constructor(ctx: SetupContext) {
    super(ctx);
  }
}

const FormGroup = defineComponent(function FormGroup(_, ctx) {
  const formGroup = new FormGroupCompo(ctx);
  return function () {
    return (
      <div>
        <div>{formGroup.attachFormChildren(this)}</div>
      </div>
    );
  };
});

export default FormGroup;
