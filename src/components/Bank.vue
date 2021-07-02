<template>
  <div class="resize">
    <v-row no-gutters>
      <v-col cols="3">
        <v-toolbar height="80">
          <v-img max-width="40" src="../assets/logo.svg"></v-img>
          <v-toolbar-title style="user-select: none" class="mx-3">
            <div class="ml-4">
              <strong style="font-size: 1.5rem" >Refoldr</strong>
            </div>
            <v-subheader style="height: auto">
              Store & share code snippets
            </v-subheader>
          </v-toolbar-title>
        </v-toolbar>
        <v-list shaped rounded :key="listKey" two-line style="height: calc(100vh - 144px); overflow-y: auto;">
          <v-list-item-group v-model="selectedSnippetIndex" color="primary">
            <div class="pa-4">
              <v-btn block @click="createNewSnippet" color="primary">
                <v-icon left>mdi-plus</v-icon> Add new
              </v-btn>
            </div>
            <v-divider class="pb-4"></v-divider>
            <template v-for="snippet in snippets">
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
            </template>

          </v-list-item-group>
        </v-list>
        <v-toolbar>
          <v-switch
              :ripple="false"
              :prepend-icon="switchIcon"
              class="mt-6 mr-2"
              :input-value="switchBool"
              inset
              persistent-hint
              color="indigo"
              @change="changeTheme"
          ></v-switch>
          <v-spacer/>
          <v-menu top left min-width="200px" rounded offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="mr-2" icon x-large v-on="on">
                <v-avatar color="indigo" size="40">
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
        </v-toolbar>
      </v-col>
        <v-col class="resizable-content" cols="9">
          <snippet-editor
            v-if="
              selectedSnippetIndex !== undefined &&
              selectedSnippet !== undefined
            "
            :selected-snippet-index="selectedSnippetIndex"
            :snippet="selectedSnippet"
            :key="snippetKey"
            @onDelete="deleteSnippet"
            @onToggleFavorite="toggleFavorite"
            @onUpdate="updateSnippet"
          ></snippet-editor>
          <default-background v-else style="height: 948px">
          <v-row align="center" style="padding-top: 35vh" justify="center">
              <v-col class="text-center" cols="12">
                <v-icon class="mb-4" color="primary" x-large dark
                  >mdi-code-tags</v-icon
                >
                <h1
                  style="user-select: none; text-shadow: 0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1);"
                  class="display-1 font-weight-thin mb-4 white--text"
                >
                  No snippet selected
                </h1>
              </v-col>
            </v-row>
          </default-background>
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
import { db, Timestamp, auth } from "../firebase";
import { supportedLangs, getLangSvg } from "../assets/langs";
import SnippetEditor from "./SnippetEditor";
import store from "../store";
import DefaultBackground from "./subcomponents/DefaultBackground";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "Bank",
  components: {
    DefaultBackground,
    SnippetEditor,
  },
  computed: {
    ...mapGetters({ user: "user" }),
    ...mapGetters({ editorSettings: "editorSettings" }),
    ...mapGetters({lastVisit: "lastVisit"}),
    ...mapGetters({ theme: "theme" })
  },
  watch: {
    snippets(value) {
      this.selectedSnippet = value[this.selectedSnippetIndex]
    }
  },
  data: function() {
    return {
      snippets: [],
      selectedSnippetIndex: undefined,
      selectedSnippet: {},
      dialogSettings: false,
      langs: supportedLangs,
      snippetKey: 0,
      snackbarAlreadyExists: false,
      snackbarNewSnippetAlreadyExists: false,
      timeout: 2000,
      listKey: 0,
      switchIcon: "",
      switchBool: undefined
    };
  },
  methods: {
    async toggleFavorite(snippet, bool) {
      await db
        .collection("snippets")
        .doc(snippet.id)
        .update({ isFavorited: bool });
      this.selectSnippet(snippet);
    },
    async createNewSnippet() {
      // check to see if the user already has an empty new snippet on their account (prevent spamming)
      let newSnippetExists = false;

      this.snippets.forEach(snippet => {
        if(snippet.name === "New snippet")
          newSnippetExists = true;
      })

      if (!newSnippetExists) {
        const docRef = await db.collection("snippets").add({
          name: "New snippet",
          content: "",
          lang: this.editorSettings.preferredLang,
          isFavorited: false,
          creationTime: Timestamp.now(),
          uid: store.state.user.data.id
        });

        let index = 0;

        for(let i = 0; i < this.snippets.length; i++)
          if(this.snippets[i].isFavorited)
            index++;

        this.selectedSnippetIndex = index;
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
      this.listKey += 1;
    },
    async updateSnippet(snippet) {
      const check = await db
        .collection("snippets")
        .where("uid", "==", this.user.data.id)
        .where("name", "==", snippet.name)
        .get();

      let count = 0;
      check.forEach(doc => {
        if (doc.id !== snippet.id)
          count++;
      });
      if (count === 0) {
        await db
          .collection("snippets")
          .doc(snippet.id)
          .update({
            name: snippet.name,
            content: snippet.content,
            lang: snippet.lang
          });
      } else {
        // we can still update content and lang!
        await db
          .collection("snippets")
          .doc(snippet.id)
          .update({
            content: snippet.content,
            lang: snippet.lang
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

      for (let i = 0; i < this.snippets.length; i++)
        if (this.snippets[i].id === snippet.id)
          this.setLastSnippetIndex(i);

      this.snippetKey += 1;
    },
    changeTheme() {
      this.switchBool = !this.switchBool;
      this.setSiteTheme(this.switchBool);

      if (this.switchBool)
        this.setEditorTheme("dracula");
      else
        this.setEditorTheme("chrome");

      this.$vuetify.theme.dark = this.switchBool;

      if (this.switchBool)
        this.switchIcon = "mdi-moon-waning-crescent";
      else
        this.switchIcon = "mdi-white-balance-sunny";
    },
    getLangSvg,
    ...mapMutations({setLastSnippetIndex: "SET_LAST_SNIPPET_INDEX"}),
    ...mapMutations({ setSiteTheme: "SET_THEME" }),
    ...mapMutations({ setEditorTheme: "SET_EDITOR_THEME" }),
    signOut() {
      auth.signOut();
    },
  },
  mounted() {
    this.switchBool = this.theme.dark;
    this.switchIcon = this.theme.dark ? "mdi-moon-waning-crescent" : "mdi-white-balance-sunny";
    this.selectedSnippetIndex = this.lastVisit.lastSnippetIndex;
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
<style>

</style>