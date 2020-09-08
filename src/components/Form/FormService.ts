import { InjectionKey, reactive, provide, isReactive } from "vue";

export type Model = { [key: string]: any };

/**
 * give the object or reactiveObject context of certain domain
 *
 * @export
 * @class FormService
 */
export default class FormService {
  static token: InjectionKey<FormService> = Symbol();
  static createForm(initalValue?: Model) {
    const formService = new FormService(initalValue);
    provide(FormService.token, formService);
    provide(formService.token, formService);
    return formService;
  }

  model: Model;
  token: string;
  constructor(initialValue?: Model) {
    if (!initialValue) {
      this.model = reactive({});
    } else if (isReactive(initialValue)) {
      this.model = initialValue;
    } else {
      this.model = reactive(initialValue);
    }
    this.token = "formId" + (~~(Math.random() * 1000) + Date.now()).toString();
  }
}
