<template>
  <div>
    <v-row no-gutters>
      <v-col cols="3" style="border-right: 1px solid #393939;">
        <v-list two-line style="height: calc(100vh - 112px); overflow-y: auto;">
          <v-list-item-group v-model="selectedSnippetIndex" color="primary">
            <div class="pa-4">
              <v-btn block @click="createNewSnippet" color="primary">
                <v-icon left>mdi-plus</v-icon> Add new
              </v-btn>
            </div>
            <v-divider></v-divider>
            <template v-for="(snippet, index) in Snippets">
              <v-list-item
                id="listItem"
                @click="selectSnippet(snippet)"
                :key="snippet.id"
              >
                <template>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-avatar
                        size="small"
                        v-bind="attrs"
                        v-on="on"
                        rounded
                        style="height: 20px; width: 20px;"
                      >
                        <img :src="getLangSvg(snippet.lang)" />
                      </v-list-item-avatar>
                    </template>
                    <span>{{ snippet.lang }}</span>
                  </v-tooltip>
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
                v-if="index < Snippets.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="9">
        <snippet
          :selected-snippet-index="selectedSnippetIndex"
          :snippet="selectedSnippet"
          @onDelete="deleteSnippet"
          @onToggleFavorite="toggleFavorite"
          @onUpdate="updateSnippet"
        ></snippet>
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
    <v-snackbar
      style="margin: 0 1rem 4rem 0"
      color="success"
      v-model="snackbarSaved"
      :timeout="timeout"
      right
    >
      Changes saved!

      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbarSaved = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { db, Timestamp } from "../firebase";
import Snippet from "./Snippet";
import store from "../store";
import Cookies from "js-cookie";

export default {
  name: "Bank",
  components: {
    snippet: Snippet
  },
  data: function() {
    return {
      Snippets: [],
      selectedSnippetIndex: undefined,
      selectedSnippet: [],
      timeout: 2000,
      snackbarAlreadyExists: false,
      snackbarNewSnippetAlreadyExists: false,
      snackbarSaved: false
    };
  },
  mounted() {
    // on after page load
    setTimeout(() => {
      let index = parseInt(Cookies.get("lastSnippet"));
      if (index !== undefined) {
        this.selectedSnippetIndex = index;
        this.selectedSnippet = this.Snippets[this.selectedSnippetIndex];
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
        console.log("create new snippet");
        const docRef = await db.collection("snippets").add({
          name: "New snippet",
          content: "",
          lang: "javascript",
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });

        this.selectedSnippetIndex = this.Snippets.length - 1;
        this.selectSnippet({
          id: docRef.id,
          name: "New snippet",
          content: "",
          lang: "javascript",
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });
      } else {
        // send user to the existing blank snippet
        for (let i = 0; i < this.Snippets.length; i++) {
          if (this.Snippets[i].name === "New snippet") {
            this.selectedSnippetIndex = i;
            this.selectSnippet(this.Snippets[i]);
            break;
          } else {
            i++;
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
        this.snackbarSaved = true;
      } else {
        this.snackbarAlreadyExists = true;
      }
    },
    async deleteSnippet(id) {
      await db
        .collection("snippets")
        .doc(id)
        .delete();

      this.selectedSnippetIndex = undefined;
      this.selectSnippet(undefined);
    },
    selectSnippet(snippet) {
      this.selectedSnippet = snippet;
      for (let i = 0; i < this.Snippets.length; i++) {
        if (this.Snippets[i].id === snippet.id) {
          Cookies.set("lastSnippet", i);
        }
      }
    },
    getLangSvg(lang) {
      if(lang !== null)
        return require(`@/assets/langs/${lang}.svg`);
      else
        return require("@/assets/langs/placeholder.svg");
    }
  },
  firestore: {
    Snippets: db
      .collection("snippets")
      .where("uid", "==", store.state.user.data.id)
      .orderBy("isFavorited", "desc")
      .orderBy("creationTime", "desc")
  }
};
</script>
<style></style>