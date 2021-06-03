<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup: () => {
    const count = ref(0);
    return { count };
  },
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
