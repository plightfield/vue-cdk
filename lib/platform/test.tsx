import { defineComponent, inject, provide } from "vue";
import { Platform } from "./platform";

const Widget = (props: { title: string, content: any }) => (
  <>
    <div>{props.title} <strong>{`${props.content}`}</strong></div>
  </>
)

const Test = defineComponent({
  name: 'platform-test',
  setup(_, context) {
    const platform = inject(Platform.key)!;
    console.log(platform);
    return () => (
      <>
        <Widget title={'This is WebKit: '} content={platform.WEBKIT}></Widget>
        <Widget title={'This is Blink:'} content={platform.BLINK}></Widget>
        <Widget title={'This is Edge: '} content={platform.EDGE}></Widget>
        <Widget title={'This is Fire Fox:'} content={platform.FIREFOX}></Widget>
        <Widget title={'This is iOS: '} content={platform.IOS}></Widget>
        <Widget title={'This is Safari:'} content={platform.SAFARI}></Widget>
        <Widget title={'This is Trident: '} content={platform.TRIDENT}></Widget>
        <Widget title={'This is Android: '} content={platform.ANDROID}></Widget>
      </>
    )
  }
});

export default Test;