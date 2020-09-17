<template>
  <div>
    <button @click="increase">Clicked {{ count }} times.</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { initState as initCounterState } from '../store/counter/state'
import mutations from '../store/counter/mutations'
import actions from '../store/counter/actions'

export default defineComponent({
  props: {
    initial: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const count = ref(props.initial)
    debugger
    const counterState = initCounterState()
    counterState.count = count.value
    // let store : Store<CounterState> =
    // store.dispatch('increment')
    debugger
    const increase = () => {
      mutations.increment(counterState)
      count.value = counterState.count
      context.root.$notifier.showMessage({
        content: 'item saved',
        color: 'success',
      })
    }

    return {
      count,
      increase,
    }
  },
})
</script>

<style scoped></style>
