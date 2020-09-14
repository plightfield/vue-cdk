declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module "good-listener" {
  const listen: (
    el: string | Element,
    event: string,
    cb: (e: any) => void
  ) => { destory: () => void };
  export default listen;
}
