<template>
  <editor
      @init="editorInit"
      theme="dracula"
      :lang="lang.value"
      v-model="snippet.content"
      :options="{
        useWorker: false,
        selectionStyle: 'text',
        enableLiveAutocompletion: true,
        displayIndentGuides: true,
        fontSize: '1.25rem',
        highlightSelectedWord: true,
        fadeFoldWidgets: true,
        showPrintMargin: false,
        highlightActiveLine: false,
        readOnly: true
      }"
  > </editor>
</template>

<script>
import Editor from "vue2-ace-editor";
import { db } from "../firebase";
import { supportedLangs } from "../assets/langs";

export default {
  name: "SharedSnippet",
  components: {
    editor: Editor
  },
  data: function() {
    return {
      snippet: {},
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
      supportedLangs.forEach(lang => {
        if(lang.value === doc.data().lang)
          this.lang = lang;
      })
    })
  }
};
</script>

<style></style>