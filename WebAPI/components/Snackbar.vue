<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" @click="show = false">
    {{ message }}
    <!-- <v-btn @click="show = false" text>
      Close
    </v-btn> -->
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
export default defineComponent({
  setup(_props, ctx) {
    const show = ref(false)
    const message = ref('')
    const color = ref('')
    const timeout = 2000
    ctx.root.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        message.value = state.snackbar.content
        color.value = state.snackbar.color
        show.value = true
      }
    })
    return {
      show,
      message,
      color,
      timeout,
    }
  },
})
</script>
