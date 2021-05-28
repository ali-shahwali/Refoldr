<template>
  <div>
    <v-row no-gutters>
      <v-col cols="3">
        <v-list two-line style="height: calc(100vh - 112px); overflow-y: auto;">
          <v-list-item-group v-model="selectedSnippetIndex" color="primary">
            <div class="pa-4">
              <v-btn block @click="createNewSnippet" color="primary">
                <v-icon left>mdi-plus</v-icon> Add new
              </v-btn>
            </div>
            <v-divider></v-divider>
            <template v-for="(snippet, index) in snippets">
              <v-list-item
                id="listItem"
                @click="selectSnippet(snippet)"
                :key="snippet.id"
              >
                <template>
                  <v-list-item-avatar
                    size="small"
                    rounded
                    style="height: 20px; width: 20px;"
                  >
                    <img :src="getLangSvg(snippet.lang)" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="snippet.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="snippet.isFavorited" color="yellow darken-3"
                      >mdi-star</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider
                v-if="index < snippets.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="9">
        <snippet
          v-if="
            selectedSnippetIndex !== undefined &&
              selectedSnippet.name !== undefined
          "
          :selected-snippet-index="selectedSnippetIndex"
          :snippet="selectedSnippet"
          :key="snippetKey"
          @onDelete="deleteSnippet"
          @onToggleFavorite="toggleFavorite"
          @onUpdate="updateSnippet"
        ></snippet>
        <v-parallax
          v-else
          translate="false"
          src="../assets/SnippetMissingBG.svg"
          style="height: calc(100vh - 112px)"
        >
          <v-row align="center" justify="center">
            <v-col class="text-center" cols="12">
              <v-icon class="mb-4" color="primary" x-large dark
                >mdi-code-tags</v-icon
              >
              <h1
                style="user-select: none"
                class="display-1 font-weight-thin mb-4"
              >
                No snippet selected
              </h1>
            </v-col>
          </v-row>
        </v-parallax>
      </v-col>
    </v-row>
    <v-snackbar
      style="margin: 0 1rem 4rem 0"
      color="error"
      v-model="snackbarAlreadyExists"
      :timeout="timeout"
      right
    >
      Snippet with that name already exists!
    </v-snackbar>
  </div>
</template>
<script>
import { db, Timestamp } from "../firebase";
import { supportedLangs } from "../assets/langs";
import Snippet from "./Snippet";
import store from "../store";
import Cookies from "js-cookie";
import { mapGetters } from "vuex";

export default {
  name: "Bank",
  components: {
    snippet: Snippet
  },
  computed: {
    ...mapGetters({ user: "user" }),
    ...mapGetters({ editorSettings: "editorSettings" })
  },
  data: function() {
    return {
      snippets: [],
      selectedSnippetIndex: undefined,
      selectedSnippet: {},
      timeout: 2000,
      snackbarAlreadyExists: false,
      snackbarNewSnippetAlreadyExists: false,
      dialogSettings: false,
      langs: supportedLangs,
      snippetKey: 0
    };
  },
  mounted() {
    let index = parseInt(Cookies.get("lastSnippet"));
    if (index !== undefined) {
      this.selectedSnippetIndex = index;
    }

    setTimeout(() => {
      this.selectedSnippet = this.snippets[index];

      // if servers are slow e.t.c set to default values
      if (this.selectedSnippet === undefined) {
        this.selectedSnippet = {};
        this.selectedSnippetIndex = undefined;
      }
    }, 1000);
  },
  methods: {
    async toggleFavorite(id, bool) {
      await db
        .collection("snippets")
        .doc(id)
        .update({ isFavorited: bool });
    },
    async createNewSnippet() {
      // check to see if the user already has an empty new snippet on their account (prevent spamming)
      const newSnippet = await db
        .collection("snippets")
        .where("uid", "==", store.state.user.data.id)
        .where("name", "==", "New snippet")
        .get();

      if (newSnippet.empty === true) {
        const docRef = await db.collection("snippets").add({
          name: "New snippet",
          content: "",
          lang: this.editorSettings.preferredLang,
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });

        this.selectedSnippetIndex = this.snippets.length - 1;
        this.selectSnippet({
          id: docRef.id,
          name: "New snippet",
          content: "",
          lang: this.editorSettings.preferredLang,
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });
      } else {
        // send user to the existing blank snippet
        for (let i = 0; i < this.snippets.length; i++) {
          if (this.snippets[i].name === "New snippet") {
            this.selectedSnippetIndex = i;
            this.selectSnippet(this.snippets[i]);
            break;
          }
        }
      }
    },
    async updateSnippet(id, name, content, lang) {
      const check = await db
        .collection("snippets")
        .where("uid", "==", store.state.user.data.id)
        .where("name", "==", name)
        .get();

      let count = 0;
      check.forEach(doc => {
        if (doc.id === id) {
          // eslint-disable-next-line no-empty
        } else count++;
      });
      if (count === 0) {
        await db
          .collection("snippets")
          .doc(id)
          .update({
            name: name,
            content: content,
            lang: lang
          });
      } else {
        // we can still update content and lang!
        await db
          .collection("snippets")
          .doc(id)
          .update({
            content: content,
            lang: lang
          });
        this.snackbarAlreadyExists = true;
      }
    },
    async deleteSnippet(id) {
      await db
        .collection("snippets")
        .doc(id)
        .delete();

      this.selectedSnippetIndex = undefined;
      this.selectSnippet({});
    },
    selectSnippet(snippet) {
      this.selectedSnippet = snippet;
      for (let i = 0; i < this.snippets.length; i++) {
        if (this.snippets[i].id === snippet.id) {
          Cookies.set("lastSnippet", i, { expires: 30 }); // expires in 1 month
        }
      }
      this.snippetKey += 1;
    },
    getLangSvg(lang) {
      if (lang !== null) return require(`@/assets/langs/${lang}.svg`);
      else return require("@/assets/langs/placeholder.svg");
    }
  },
  firestore: {
    snippets: db
      .collection("snippets")
      .where("uid", "==", store.state.user.data.id)
      .orderBy("isFavorited", "desc")
      .orderBy("creationTime", "desc")
  }
};
</script>
<style></style>