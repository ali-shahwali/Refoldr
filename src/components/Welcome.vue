<template>
  <div>
    <section id="hero">
      <v-row no-gutters>
        <v-img :height="'30vh'" src="../assets/welcomeBG.svg">
          <v-theme-provider dark>
            <v-container fill-height>
              <v-row
                align="center"
                class="white--text mx-auto"
                justify="center"
              >
                <v-col class="white--text text-center" cols="12" tag="h1">
                  <br />

                  <span
                    :class="[
                      $vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4'
                    ]"
                    class="font-weight-black"
                    style="user-select: none"
                  >
                    <code>refoldr</code>
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section id="about-me">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-3">
          Store your code snippets
        </h2>

        <div></div>

        <v-responsive class="mx-auto mb-8" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-responsive
          class="mx-auto title font-weight-light mb-8"
          max-width="720"
        >
          refoldr stores your code snippets and allows for ease of use and
          access, Tired of losing your snippets? Get started today!
        </v-responsive>

        <div></div>

        <v-btn
          color="primary"
          class="mt-5"
          elevation="24"
          x-large
          @click="signIn"
          >Continue with google </v-btn
        >
      </v-container>

      <div class="py-12"></div>
    </section>
  </div>
</template>

<script>
import { signInWithGoogle } from "../firebase";
import {mapGetters} from "vuex";
export default {
  name: "Welcome",
  computed: {
    ...mapGetters({user: "user"})
  },
  methods: {
    signIn: signInWithGoogle
  }
};
</script>

<style></style>