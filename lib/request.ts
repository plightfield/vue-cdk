import { provide } from "vue";

/**
 * regist a request method
 * *from xhr,axios,fetch or someOther utils
 *
 * @template P
 * @template T
 * @param {(res: P) => Promise<T>} future
 */
function registRequest<P, T>(future: (res: P) => Promise<T>) {
  provide("cdk-request", future);
}

// function request<P,T>(config:P,){

// }
