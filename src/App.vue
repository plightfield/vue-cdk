<script lang="ts">
import { reactive, ref, watchEffect } from "vue";

export default {
  setup() {
    const count = ref(0);
    watchEffect(() => {
        console.log(count.value);
    });

    return {
      count
    }
  }
}

</script>

<template>
  <div>{{ count }}</div>
</template>

