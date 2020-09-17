<template>
  <v-app id="inspire">
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark>
      <v-toolbar-title style="width: 330px" class="ml-0 pl-4">
        <span
          class="hidden-sm-and-down">IT Software management ({{ appVersion }})</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img
            src="/assets/images/hslu_logo_small.png"
            alt="HSLU" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="pa-10">
        <v-row>
          <nuxt />
        </v-row>
      </v-container>
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  components: {
    Snackbar: () => import('~/components/Snackbar.vue'),
  },
  data: () => ({
    appVersion: process.env.VERSION,
  })
}
</script>
