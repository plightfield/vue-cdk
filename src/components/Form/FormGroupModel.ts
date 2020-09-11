import AbstractForm from "./AbstractForm";
import { SetupContext, InjectionKey, provide } from "vue";

export default class FormGroupModel extends AbstractForm {
  static readonly token: InjectionKey<FormGroupModel> = Symbol();
  static setup(ctx: SetupContext, model?: { [key: string]: any }) {
    const service = new FormGroupModel(ctx, model);
    provide(FormGroupModel.token, service);
    return service;
  }

  type = "group";
  model: { [key: string]: any };
  constructor(ctx: SetupContext, model?: { [key: string]: any }) {
    super(ctx);
    this.model = model || {};
  }
}
