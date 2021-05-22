<template>
  <v-container style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="2"></v-col>
      <v-col  cols="8">
        <v-toolbar
            class="mb-4"
        >
          <v-toolbar-title>{{snippet.name}} by {{user.name}}</v-toolbar-title>
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
          highlightActiveLine: false,
        }"
          style="height: 70vh"
      > </editor></v-col>
      <v-col cols="2"></v-col>

    </v-row>
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
      lang: ""
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
    }
  },
  async created() {
    await db.collection("snippets")
    .doc(this.$route.params.id)
    .get()
    .then((doc) => {
      this.snippet = doc.data();
      getUserByUid(doc.data().uid)
          .get()
      .then((doc) => {
        this.user = doc.data();
      });
      supportedLangs.forEach(lang => {
        if(lang.value === doc.data().lang)
          this.lang = lang;
      })
    })
  }
};
</script>

<style></style>