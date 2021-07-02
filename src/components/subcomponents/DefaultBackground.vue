<template>
  <div :key="bgKey" :class="backgroundClass">
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
    <slot></slot>
  </div>
</template>

<script>
import store from "../../store";
import {mapGetters} from "vuex";

export default {
  name: "DefaultBackground",
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
      backgroundClass: store.state.theme.dark ? "bgDark" : "bgLight",
      bgKey: 0,
    }
  }
}
</script>

<style scoped>
.bgLight {
  background: #4e54c8;
  width: 100%;
  height: calc(100vh - 48px);
}

.bgDark {
  background: #000;
  width: 100%;
  height: calc(100vh - 48px);
}

.circles {
  position: absolute;
  bottom: 0;
  left: auto;
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