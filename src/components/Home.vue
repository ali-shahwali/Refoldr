<template>
  <bank v-if="user.loggedIn"/>
  <welcome v-else/>
</template>

<script>
import Welcome from "./Welcome";
import {mapGetters} from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapGetters({user: "user"})
  },
  components: {
    bank: () => import("./Bank"), // lazy load to avoid crashing, REALLY DUMB!
    welcome: Welcome
  }
}
</script>

<style scoped>

</style>