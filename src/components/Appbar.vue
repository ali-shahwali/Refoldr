<template>
  <v-app-bar app flat outlined>
    <v-btn class="text-none" link to="/" :ripple="false" depressed plain text>
      <v-img max-width="25" src="../assets/logo.svg"></v-img>
      <v-toolbar-title class="mx-3">Refoldr</v-toolbar-title>
    </v-btn>
    <v-spacer></v-spacer>
    <div v-if="user.loggedIn">
      <v-menu bottom min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar color="indigo" size="48">
              <v-img :src="user.data.photoURL" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <p class="caption mt-1">
                {{ user.data.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="signOut">
                Sign out
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </div>
    <div v-else>
      <v-btn small text @click="signIn"
      ><v-icon left>mdi-google</v-icon>sign in</v-btn
      >
    </div>
  </v-app-bar>
</template>

<script>
import { signInWithGoogle, auth } from "../firebase";
import { mapGetters } from "vuex";

export default {
  name: "Appbar",
  computed: {
    ...mapGetters({ user: "user" }),
  },
  data: function() {
    return {
      switchIcon: "",
      switchBool: undefined
    };
  },
  methods: {
    signOut() {auth.signOut()},
    signIn: signInWithGoogle,
  },
};
</script>

<style scoped>

</style>