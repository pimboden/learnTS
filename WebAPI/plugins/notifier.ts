import { Plugin } from '@nuxt/types'

import { SnackbarState } from './../store/snackbar/types'

declare module 'vue/types/vue' {
  // this.$notifier inside Vue components
  interface Vue {
    $notifier: {
      showMessage: (notifierOptions: SnackbarState) => void
    }
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$notifier inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $notifier: {
      showMessage: (notifierOptions: SnackbarState) => void
    }
  }
  interface Context {
    $notifier: {
      showMessage: (notifierOptions: SnackbarState) => void
    }
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $notifier: {
      showMessage: (notifierOptions: SnackbarState) => void
    }
  }
}

const notifierPlugin: Plugin = (context, inject) => {
  inject('$notifier', {
    showMessage(notifierOptions: SnackbarState) {
      context.store.commit('snackbar/showMessage', notifierOptions)
    },
  })
}
export default notifierPlugin
