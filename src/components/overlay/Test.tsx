
import { defineComponent, ref } from "vue";
import Overlay from "./Overlay";


const Test = defineComponent(() => {
  const showRef = ref(false);
  const click = () => {
    showRef.value = true;
  }

  const update = (value: boolean) => {
    showRef.value = value;
  }

  return () => (
    <>
      <button onClick={click}>click me</button>
      <Overlay show={showRef.value} onShowChanged={update}>
        {() => (<div>'this is test'</div>)}
      </Overlay>
    </>
  
  );
});

export default Test;