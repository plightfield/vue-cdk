import { InjectionKey, inject, Ref, toRef, defineComponent } from "vue";
import FormService, { Model } from "./FormService";

export class FormItemService {
  static getFormItem(name: string, token?: string) {
    return new FormItemService(name, token);
  }
  name: string;
  formService: FormService;
  model: Ref<any>;
  constructor(name: string, token?: string) {
    this.name = name;
    if (token) {
      this.formService = inject(token);
    } else {
      this.formService = inject(FormService.token);
    }
    this.model = toRef(this.formService.model, this.name);
  }
}
