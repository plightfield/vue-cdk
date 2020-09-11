<<<<<<< HEAD
<script lang="ts">
import { ComponentPublicInstance, defineComponent, onMounted, reactive, ref, watchEffect, h} from "vue";
import Overlay from './overlay/overlay.vue';
export default defineComponent({
  components: {
    Overlay,
  },
  setup(props, context) {
    const overlayRef = ref();

    return {
      overlayRef,
    }
  },
  mounted() {
    console.log(this.overlayRef);
    this.overlayRef
    // this.overlayRef
    // (this.$root.$el as Element).appendChild();
  }
});

</script>

<template>
  <div>{{count}}</div>
  <template ref="overlayRef">
    <overlay></overlay>
  </template>
</template>

=======
<template>
  <div>
    <Test />
  </div>
</template>

<script>
import Test from "./components/Test.tsx";
export default {
  name: "app",
  components: { Test },
  setup(_, ctx) {},
};
</script>
>>>>>>> source/master
