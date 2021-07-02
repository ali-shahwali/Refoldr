<template>
  <v-app id="app" >
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
export default {
  name: "App",
};
</script>

<style>
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(97, 97, 97, 0.6);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: rgba(97, 97, 97, 0.6);
}
html {
  overflow-y: auto !important;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #2196F3;
}
</style>