<template>
  <v-container style="height: 100%" v-if="theme !== undefined && lang !== undefined">
    <v-row style="height: 100%">
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-toolbar class="mb-4 mt-4" rounded>
          <v-toolbar-title
            ><v-avatar
              rounded
              style="height: 30px; width: 30px;"
              class="mr-2"
              left
              ><img :src="lang.avatar"/></v-avatar
            >{{ snippet.name }}</v-toolbar-title
          >
          <v-subheader>
            <v-avatar style="height: 30px; width: 30px">
              <img :src="creator.photoURL" />
            </v-avatar>
            {{ creator.name }}</v-subheader
          >
          <v-spacer></v-spacer>

<!--          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="saveToBank()"
                  icon
              >
                <v-icon dark>
                  mdi-folder-download
                </v-icon>
              </v-btn>
            </template>
            <span>Save to bank</span>
          </v-tooltip>-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                @click="copySnippetToClipboard()"
                icon
              >
                <v-icon dark>
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </template>
            <span>Copy to clipboard</span>
          </v-tooltip>
        </v-toolbar>
        <editor
          :key="editorKey"
          @init="editorInit(theme, lang.value)"
          :theme="theme"
          :lang="snippet.lang"
          v-model="snippet.content"
          :options="{
            useWorker: false,
            selectionStyle: 'text',
            displayIndentGuides: true,
            fontSize: '1.25rem',
            highlightSelectedWord: true,
            fadeFoldWidgets: true,
            showPrintMargin: false,
            highlightActiveLine: false
          }"
          style="height: 66vh; border-radius: 7px;"
        >
        </editor>
        <v-text-field
          append-icon="mdi-link"
          rounded
          solo
          class="mt-2"
          @focus="$event.target.select()"
          readonly
          autofocus
          label="Link"
          v-model="link"
          @click:append="copyLink"
        />
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-snackbar
      style="margin: 0 0 4rem 0"
      color="primary"
      v-model="snackbarCopied"
      :timeout="timeout"
    >
      Copied to clipboard!
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbarCopied = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
  <v-progress-linear indeterminate v-else></v-progress-linear>
</template>

<script>
import Editor from "vue2-ace-editor";
import { db, getUserByUid } from "../firebase";
import { supportedLangs } from "../assets/langs";
import store from "../store";
import {init} from "../assets/editor";
import {mapGetters} from "vuex";

export default {
  name: "SharedSnippet",
  metaInfo() {
    return {
      title: "Refoldr | Shared snippet",
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: `${this.snippet.name} by ${this.creator.name}`,
        }
      ],
    };
  },
  components: {
    editor: Editor,
  },
  computed: {
    editorTheme() {
      return store.state.theme.editorTheme;
    },
    ...mapGetters({ siteTheme: "theme" }),
    ...mapGetters({user: "user"})
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    editorTheme(newTheme, oldTheme) {
      this.theme = newTheme;
      this.editorKey += 1;
    }
  },
  data: function() {
    return {
      snippet: {},
      creator: {},
      link: "",
      lang: undefined,
      theme: undefined,
      snackbarCopied: false,
      timeout: 2000,
      editorKey: 0,
    };
  },
  methods: {
    editorInit: init,
    copySnippetToClipboard() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.snippet.content;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbarCopied = true;
    },
    copyLink() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.link;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbarCopied = true;
    },
    async saveToBank() {
      await db
      .collection("snippets")
      .add({
        uid: this.user.data.uid,
        name: this.snippet.name,
        lang: this.snippet.lang,
        content: this.snippet.content,
        isFavorited: false,
        creationTime: this.snippet.creationTime,
      })
    }
  },
  async created() {

    this.theme = this.siteTheme.editorTheme;

    await db
      .collection("snippets")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        this.snippet = doc.data();
        if (this.snippet === undefined) {
          this.$router.push("/not_found");
        } else {
          this.link = `https://refoldr.com/snippet/${doc.id}`;
          getUserByUid(doc.data().uid)
            .get()
            .then(docRef => {
              this.creator = docRef.data();
            });
          supportedLangs.forEach(lang => {
            if (lang.value === doc.data().lang) this.lang = lang;
          });
        }
      });
  },
};
</script>

<style></style>