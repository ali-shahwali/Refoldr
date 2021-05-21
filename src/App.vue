<template>
  <v-app id="app">
    <appbar/>
    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>refoldr</strong> — <a href="https://discord.gg/8BFYr5eD" target="_blank">Discord</a>
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
  methods: {
  },
};
</script>

<style>
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #1c1c1c;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #1c1c1c;
}
html {
  overflow-y: auto !important;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>