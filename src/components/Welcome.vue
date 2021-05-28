<template>
  <div>
    <section id="about-me">
      <v-row no-gutters>
        <default-background>
          <div class="py-12"></div>
          <v-container class="text-center">
            <v-row
              align="center"
              class="white--text mx-auto mb-16"
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
                  <code>Refoldr</code>
                </span>
              </v-col>
            </v-row>

            <h2
              class="display-2 white--text font-weight-bold mb-3"
              style="text-shadow: 0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1);"
            >
              Store & share code snippets
            </h2>

            <div></div>

            <v-responsive class="mx-auto mb-8" width="56">
              <v-divider class="mb-1"></v-divider>

              <v-divider></v-divider>
            </v-responsive>

            <v-responsive
              class="mx-auto white--text title font-weight-light mb-8"
              max-width="720"
              style="text-shadow: 0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1);"
            >
              Refoldr stores your code snippets and allows for ease of use and
              access, Tired of losing your snippets? Get started today!
            </v-responsive>

            <div></div>

            <v-btn
              v-if="dark"
              color="indigo"
              class="mt-5 white--text"
              elevation="24"
              x-large
              @click="signIn"
              ><img
                src="../assets/google-icon.svg"
                height="30px"
                class="mr-4"
              />
              Continue with google
            </v-btn>
            <v-btn
              v-else
              color="white"
              class="mt-5 black--text"
              elevation="24"
              x-large
              @click="signIn"
              ><img
                src="../assets/google-icon.svg"
                height="30px"
                class="mr-4"
              />
              Continue with google
            </v-btn>
          </v-container>

          <div class="py-12"></div>
        </default-background>
      </v-row>
    </section>
  </div>
</template>

<script>
import { signInWithGoogle } from "../firebase";
import DefaultBackground from "./subcomponents/DefaultBackground";

export default {
  name: "Welcome",
  components: {
    defaultBackground: DefaultBackground
  },

  data: function() {
    return {};
  },
  methods: {
    signIn: signInWithGoogle
  }
};
</script>

<style></style>