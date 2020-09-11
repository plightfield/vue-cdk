import FormGroup from "./Form/Control";
import { defineComponent, watch, watchEffect } from "vue";
import Schema from "async-validator";

const TestForm = defineComponent(function (props, ctx) {
  return function () {
    console.log(ctx.attrs);
    return (
      <>
        <input />
      </>
    );
  };
});
const Test = defineComponent(function () {
  const schema = new Schema({
    0: [
      { required: true, message: "fuck" },
      { min: 13, message: "hahahah" },
    ],
  });
  schema
    .validate(["sdff", "sdfsdf"], {}, (...data) => {
      console.log(data);
    })
    .then(console.log)
    .catch(console.log);
  return () => <FormGroup>{() => <TestForm />}</FormGroup>;
});

export default Test;
