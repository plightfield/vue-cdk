<template>
  <div>
    <OverlayTest />
    <!-- <teleport to="#app">
      <div>test</div>
    </teleport> -->
  </div>
</template>

<script>
import Test from "./components/Test.tsx";
import OverlayTest from "./components/overlay/Test";
export default {
  name: "app",
  components: { Test, OverlayTest },
  setup(_, ctx) {},
};
</script>
