declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'good-listener' {
  const listen: any
  export default listen
}
