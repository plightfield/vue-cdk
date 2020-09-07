<script lang="ts">
import { ComponentPublicInstance, defineComponent, onMounted, reactive, ref, watchEffect, h} from "vue";

export default defineComponent({
  setup(props, context) {
    const count = ref(0);
    watchEffect(() => {
        console.log(count.value);
    });

    return {
      count
    }
  },
  mounted() {
    console.log('overlay', this.$root);

  }
});

</script>

<template>
  <div class="fuck">{{ count }}</div>
</template>

<style scoped>
.fuck {
    position: fixed;
    top: 10px;
    left: 10px;
    height: 100px;
    width: 100px;
    background: red;
}
</style>

