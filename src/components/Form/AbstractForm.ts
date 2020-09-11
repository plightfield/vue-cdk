import Schema, { Rules, ErrorList } from "async-validator";
import { SetupContext, Ref, ComputedRef, ref, computed } from "vue";

/**
 * abstract form class
 *
 * @export
 * @abstract
 * @class AbstractForm
 */
export default abstract class AbstractForm {
  /**
   * form model
   * can be an array or an object
   *
   * @abstract
   * @type {({ [key: string]: any } | Ref<Array<any>>)}
   * @memberof AbstractForm
   */
  abstract model: { [key: string]: any } | Ref<Array<any>>;

  /**
   * the validator use async validator to validate model
   *
   * @memberof AbstractForm
   */
  validator = new Schema({});

  /**
   * validation ruls，in {key: [ruleItems]} form
   *
   * @type {Rules}
   * @memberof AbstractForm
   */
  rules: Rules = {};

  /**
   * Vue setup context, use to emit events
   *
   * @type {SetupContext}
   * @memberof AbstractForm
   */
  ctx: SetupContext;

  /**
   * checkout errors in { message: '' , field: 'form'}
   *
   * @type {(Ref<ErrorList | null>)}
   * @memberof AbstractForm
   */
  errorList: Ref<ErrorList | null>;

  /**
   * if this form is valid
   *
   * @type {ComputedRef<boolean>}
   * @memberof AbstractForm
   */
  valid: ComputedRef<boolean>;

  /**
   * if this form is focusing
   *
   * @type {Ref<boolean>}
   * @memberof AbstractForm
   */
  focus: Ref<boolean>;

  /**
   * if this form has been touched - once focused
   *
   * @type {Ref<boolean>}
   * @memberof AbstractForm
   */
  touched: Ref<boolean>;

  constructor(ctx: SetupContext) {
    this.ctx = ctx;
    this.errorList = ref(null);
    this.valid = computed(() => (this.errorList.value === null ? true : false));
    this.focus = ref(false);
    this.touched = ref(false);
  }

  /**
   * set the validation rules, and refresh validator
   *
   * @param {Rules} rules
   * @memberof AbstractForm
   */
  setRules(rules: Rules) {
    this.rules = rules;
    this.validator = new Schema(rules);
  }

  /**
   * attach with the render this context
   * let child know that they are underneath the FormGroup/FormArray
   *
   * @static
   * @param {*} self
   * @returns
   * @memberof FormGroupCompo
   */
  attachFormChildren(self: any) {
    const defaultSlots = self.$slots.default();
    for (let slot of defaultSlots) {
      slot.props = { __isFormChild: true, ...slot.props };
    }
    return defaultSlots;
  }
}
