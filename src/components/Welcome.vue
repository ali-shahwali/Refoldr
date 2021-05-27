<template>
  <div>

    <section id="about-me">
    <v-row no-gutters>
        <v-img :height="'calc(100vh - 112px)'" src="../assets/SnippetMissingBG.svg">
      <div class="py-12"></div>

      <v-container class="text-center">
        <v-row align="center" class="white--text mx-auto mb-16" justify="center">
          <v-col class="white--text text-center" cols="12" tag="h1">
            <br />

            <span
              :class="[
                $vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4',
              ]"
              class="font-weight-black"
              style="user-select: none"
            >
              <code>Refoldr</code>
            </span>
          </v-col>
        </v-row>

        <h2 class="display-2 white--text font-weight-bold mb-3">
          Store your code snippets
        </h2>

        <div></div>

        <v-responsive class="mx-auto mb-8" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-responsive
          class="mx-auto white--text title font-weight-light mb-8"
          max-width="720"
        >
          Refoldr stores your code snippets and allows for ease of use and
          access, Tired of losing your snippets? Get started today!
        </v-responsive>

        <div></div>

        <v-btn
          color="indigo"
          class="mt-5 white--text"
          elevation="24"
          x-large
          @click="signIn"
          ><img src="../assets/google-icon.svg" height="30px" class="mr-4" />
          Continue with google
        </v-btn>
      </v-container>

      <div class="py-12"></div>
      </v-img>
      </v-row>
    </section>
  </div>
</template>

<script>
import { signInWithGoogle } from "../firebase";
import { mapGetters } from "vuex";
export default {
  name: "Welcome",
  computed: {
    ...mapGetters({ user: "user" }),
  },
  methods: {
    signIn: signInWithGoogle,
  },
};
</script>

<style></style>
