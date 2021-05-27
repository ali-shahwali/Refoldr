<template>
  <v-app id="app" >
    <appbar/>
    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Refoldr</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Appbar from "./components/Appbar";

export default {
  name: "App",
  components: {
    appbar: Appbar
  },
  data: () => ({
  }),

};
</script>

<style>

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0,0,0,0);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: rgba(0,0,0,0);
}
html {
  overflow-y: auto !important;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #2196F3;
}
</style>