<template>
  <div>
    <v-row no-gutters>
      <v-col cols="3" style="border-right: 1px solid #393939;">
        <v-list two-line style="height: calc(100vh - 112px); overflow-y: auto;">
          <v-list-item-group v-model="selectedSnippetIndex" color="primary">
            <div class="pa-4">
              <v-row>
                <v-col cols="11">
                  <v-btn block @click="createNewSnippet" color="primary">
                    <v-icon left>mdi-plus</v-icon> Add new
                  </v-btn>
                </v-col>
                <v-col class="pl-0" cols="1">
                  <v-btn @click="dialogSettings = true" icon>
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
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
          v-if="selectedSnippetIndex !== undefined && selectedSnippet.name !== undefined"
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
            style="height: calc(100vh - 113px)"
        >
          <v-row align="center" justify="center">
            <v-col class="text-center" cols="12">
              <v-icon class="mb-4" color="primary" x-large dark
              >mdi-code-tags</v-icon
              >
              <h1 style="user-select: none" class="display-1 font-weight-thin mb-4">
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

    <v-dialog width="33vw" v-model="dialogSettings" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogSettings = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Preferences</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Set preferred language</v-list-item-title>
              <v-list-item-subtitle>
                <v-autocomplete
                  @change="Cookies.set('preferredLang', preferredLang, {expires: 90})"
                  style="max-width: 300px;"
                  v-model="preferredLang"
                  :items="langs"
                  filled
                  solo
                  class="mt-6"
                  label="Language"
                  menu-props="auto"
                  spellcheck="false"
                  item-text="name"
                  item-value="value"
                >
                  <template v-slot:selection="data">
                    <v-avatar
                      rounded
                      size="small"
                      style="height: 20px; width: 20px;"
                      class="mr-2"
                      left
                    >
                      <v-img :src="data.item.avatar"></v-img>
                    </v-avatar>
                    {{ data.item.name }}
                  </template>
                  <template v-slot:item="data">
                    <template>
                      <v-list-item-avatar
                        rounded
                        size="small"
                        style="height: 20px; width: 20px;"
                      >
                        <img :src="data.item.avatar" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.name"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { db, Timestamp } from "../firebase";
import { supportedLangs } from "../assets/langs";
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
      selectedSnippetIndex: {},
      selectedSnippet: [],
      timeout: 2000,
      snackbarAlreadyExists: false,
      snackbarNewSnippetAlreadyExists: false,
      dialogSettings: false,
      langs: supportedLangs,
      preferredLang: "javascript",
      snippetKey: 0,
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
      let prefLang = Cookies.get("preferredLang");
      if(prefLang !== undefined)
        this.preferredLang = prefLang;
      else
        Cookies.set("preferredLang", "javascript", {expires: 90})
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
          lang: Cookies.get("preferredLang"),
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });

        this.selectedSnippetIndex = this.Snippets.length - 1;
        this.selectSnippet({
          id: docRef.id,
          name: "New snippet",
          content: "",
          lang: Cookies.get("preferredLang"),
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
          Cookies.set("lastSnippet", i, { expires: 30 }); // expires in 1 month
        }
      }
      this.snippetKey += 1;
    },
    getLangSvg(lang) {
      if (lang !== null) return require(`@/assets/langs/${lang}.svg`);
      else return require("@/assets/langs/placeholder.svg");
    },
    savePreferences() {
      Cookies.set("preferredLang", this.preferredLang, {expires: 90});
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