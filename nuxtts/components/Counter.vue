<template>
  <div>
    <button @click="increase">Clicked {{ count }} times.</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
export default defineComponent({
  props: {
    initial: {
      type: Number,
      default: 0,
    },
  },
  setup(props, _context) {
    const count = ref(props.initial)
    const increase = () => {
      count.value++
    }

    return {
      count,
      increase,
    }
  },
})
</script>

<style scoped></style>
