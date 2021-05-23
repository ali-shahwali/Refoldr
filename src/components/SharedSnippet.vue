<template>
  <v-container style="height: 100%">
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
          <v-subheader>by {{ user.name }}</v-subheader>
          <v-spacer></v-spacer>

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
          @init="editorInit"
          theme="dracula"
          :lang="lang.value"
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
          style="height: 70vh; border-radius: 7px"
        >
        </editor
      ></v-col>
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
</template>

<script>
import Editor from "vue2-ace-editor";
import { db, getUserByUid } from "../firebase";
import { supportedLangs } from "../assets/langs";

export default {
  name: "SharedSnippet",
  components: {
    editor: Editor
  },
  data: function() {
    return {
      snippet: {},
      user: {},
      lang: "",
      snackbarCopied: false,
      timeout: 2000
    };
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools");
      require("brace/mode/html");
      require("brace/mode/javascript");
      require("brace/mode/python");
      require("brace/mode/c_cpp");
      require("brace/mode/csharp");
      require("brace/mode/haskell");
      require("brace/mode/elixir");
      require("brace/mode/rust");
      require("brace/mode/r");
      require("brace/mode/css");
      require("brace/mode/jsx");
      require("brace/mode/swift");
      require("brace/mode/golang");
      require("brace/mode/php");
      require("brace/mode/java");
      require("brace/mode/typescript");
      require("brace/mode/sql");
      require("brace/mode/mysql");
      require("brace/mode/sqlserver");
      require("brace/mode/matlab");
      require("brace/theme/dracula");
    },
    copySnippetToClipboard() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.snippet.content;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbarCopied = true;
    }
  },
  async created() {
    await db
      .collection("snippets")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        this.snippet = doc.data();
        if(this.snippet === undefined) {
          this.$router.push('/not_found');
        }
        else {
          getUserByUid(doc.data().uid)
              .get()
              .then(docRef => {
                this.user = docRef.data();
              });
          supportedLangs.forEach(lang => {
            if (lang.value === doc.data().lang) this.lang = lang;
          });
        }
      });
  }
};
</script>

<style></style>