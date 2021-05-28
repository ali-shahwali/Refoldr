<template>
  <div>
    <section id="about-me">
      <v-row no-gutters>
        <div :key="bgKey" :class="this.backgroundClass">
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>

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
                    $vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4',
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
        </div>
      </v-row>
    </section>
  </div>
</template>

<script>
import { signInWithGoogle } from "../firebase";
import { mapGetters } from "vuex";
import store from "../store";

export default {
  name: "Welcome",
  computed: {
    dark() {
      return store.state.theme.dark;
    },
    ...mapGetters({ user: "user" }),
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    dark(isDark, oldTheme) {
      if (isDark) this.backgroundClass = "bgDark";
      else this.backgroundClass = "bgLight";

      this.bgKey += 1;
    },
  },
  data: function() {
    return {
      backgroundClass: "",
      bgKey: 0,
    };
  },
  methods: {
    signIn: signInWithGoogle,
  },
  mounted() {
    if (this.dark) this.backgroundClass = "bgDark";
    else this.backgroundClass = "bgLight";
  },
};
</script>

<style>
.bgLight {
  background: #4e54c8;
  background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
  width: 100%;
  height: calc(100vh - 112px);
}

.bgDark {
  background: #000;
  background: -webkit-linear-gradient(to left, #111, #fff);
  width: 100%;
  height: calc(100vh - 112px);
}

.circles {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
}

.circles li:nth-child(1) {
  left: 25%;
  width: 40px;
  height: 40px;
  animation-delay: 0s;
}

.circles li:nth-child(2) {
  left: 10%;
  width: 10px;
  height: 10px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 10px;
  height: 10px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 30px;
  height: 30px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 10px;
  height: 10px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 55px;
  height: 55px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 75px;
  height: 75px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 12.5px;
  height: 12.5px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 7.5px;
  height: 7.5px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 75px;
  height: 75px;
  animation-delay: 0s;
  animation-duration: 11s;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
