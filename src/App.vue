<template>
  <div id="app">
    <v-app>
      <div class="wrap">
        <v-overlay v-if="$store.state.home.is_loading">
          <v-progress-circular primary indeterminate> </v-progress-circular>
        </v-overlay>
        <appHeader></appHeader>
        <router-view></router-view>
        <appFooter></appFooter>
      </div>
    </v-app>
  </div>
</template>

<script>
import Header from "./components/common/Header.vue";
import Footer from "./components/common/Footer.vue";
export default {
  components: {
    appHeader: Header,
    appFooter: Footer
  }
};
</script>
