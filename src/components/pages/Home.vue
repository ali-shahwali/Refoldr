<template>
  <bank v-if="user.loggedIn"/>
  <welcome v-else/>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Home",
  metaInfo: {
    title: "Refoldr",
    meta: [
      {
        vmid: 'description',
        name: 'description',
        content: 'Store your code snippets!',
      }]
  },
  computed: {
    ...mapGetters({user: "user"})
  },
  components: {
    bank: () => import("../Bank"), // lazy load to avoid crashing, REALLY DUMB!
    welcome: () => import("../Welcome")
  }
}
</script>

<style scoped>

</style>