import Vue from 'vue'
import { Context, Middleware } from '@nuxt/types'
import { Framework } from 'vuetify'

// Fix use of nuxt specific component options layout, middleware, fetch

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fetch?(ctx: Context): Promise<void> | void
    layout?: string | ((ctx: Context) => string)
    middleware?: Middleware | Middleware[]
  }
}

// Fix access to this.$vuetify in the definedComponent i.e. context.root.$vuetify.breakpoint
declare module 'vue/types/vue' {
  interface Vue {
    $vuetify: Framework
  }
}

declare module '*.vue' {
  export default Vue
}
