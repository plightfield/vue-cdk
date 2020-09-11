import { InjectionKey, Ref, inject } from "vue";
import { set as _set, get as _get } from "lodash";

import Utils from "./utils";

export class AccrossingDataRoot<T> {
  token: string | InjectionKey<AccrossingDataRoot<T>>;
  model: Ref<T>;
  constructor(model: T, token?: InjectionKey<AccrossingDataRoot<T>>) {
    this.model = Utils.setRef(model);
    if (token) {
      this.token = token;
      return;
    }
    this.token = Utils.uuid();
  }
}

export class AccrossingData<T> {
  static token: InjectionKey<AccrossingData<any>>;
  root: AccrossingDataRoot<T>;
  parent: AccrossingData<T> | null;

  key: string;
  keyList: string[];
  ifShallow: boolean;
  keyListMap: (val: string[]) => string[] = (val) => val;

  get model() {
    return _get(this.model, ["value", ...this.keyListMap(this.keyList)]);
  }
  set model(val: any) {
    _set(this.model, ["value", ...this.keyListMap(this.keyList)], val);
  }

  constructor(key: string, token: any) {
    this.key = key;
    this.keyList = [key];
    this.parent = inject(AccrossingData.token, null);

    if (!this.parent) {
      this.ifShallow = true;
    } else {
      this.ifShallow = false;
      this.keyList = [...this.parent.keyList, key];
    }

    this.root = inject(token, null) as any;
    if (!this.root) {
      throw new Error("please use acrossing data under a root");
    }
  }
}
