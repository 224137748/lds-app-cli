<template>
  <div>
    <hello-world :msg="'你好啊，李银河！'" />
    <h1>{{ count }}</h1>
    <button @click="handleClick">按钮</button>
  </div>
</template>

<script>
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "app",
  components: {
    HelloWorld,
  },
  setup: () => {
    const count = ref(0);

    const handleClick = () => {
      count.value++;
      console.log(count.value);
    };

    return {
      count,
      handleClick,
    };
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
</style>
