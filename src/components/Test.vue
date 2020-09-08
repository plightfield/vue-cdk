
<script lang="ts">
import FormService from "./Form/FormService";
import { Form, FormItem } from "./Form/Form";
import { reactive, watch, watchEffect } from "vue";
export default {
  name: "test",
  components: { "test-form": Form, FormItem },
  setup() {
    // 直接传入对象也可
    // const form = FormService.createForm({
    //   name:'test',
    //   password: 'test'
    // });
    const model = reactive({
      name: "test",
      password: "test",
    });
    const form = FormService.createForm(model);
    watch(model, console.log);
    return {
      token: form.token,
    };
  },
};
</script>
<template>
  <div>
    <test-form :token="token">
      <form-item name="name" :token="token"></form-item>
      <form-item name="password"></form-item>
    </test-form>
  </div>
</template>