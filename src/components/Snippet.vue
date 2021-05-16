<template>
  <div>
    <v-toolbar v-if="selectedSnippetIndex !== undefined">
      <v-text-field
        dense
        solo
        class="mt-8"
        label="Title"
        placeholder="Min 3 characters"
        v-model="snippet.name"
        style="max-width: 450px;"
        spellcheck="false"
      ></v-text-field>
      <v-select
        dense
        solo
        class="mt-8 ml-5"
        v-model="snippet.lang"
        :items="langs"
        menu-props="auto"
        label="Language"
        style="max-width: 300px"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn @click="updateSnippet" icon>
        <v-icon color="primary">mdi-content-save</v-icon>
      </v-btn>

      <v-btn
        @click="toggleFavorite(snippet.id, false)"
        icon
        v-if="snippet.isFavorited"
      >
        <v-icon color="yellow darken-3">mdi-star</v-icon>
      </v-btn>
      <v-btn @click="toggleFavorite(snippet.id, true)" icon v-else>
        <v-icon color="grey lighten-1">mdi-star-outline</v-icon>
      </v-btn>

      <v-btn @click="deleteSnippet" icon>
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <Editor
      v-if="selectedSnippetIndex !== undefined"
      class="editor"
      language="Snippet.lang"
      v-model="snippet.content"
      :highlight="highlighter"
      :line-numbers="lineNumbers"
      :readonly="readonly"
    >
    </Editor>
    <v-parallax translate="false" src="../assets/SnippetMissingBG.svg" style="height: calc(100vh - 113px)" v-else>
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

    <v-snackbar
      style="margin: 0 1rem 4rem 0"
      color="error"
      v-model="snackbarDeleted"
      :timeout="timeout"
      right
    >
      {{ textDeleted }}

      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbarDeleted = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-css";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-markup";


export default {
  name: "Snippet",
  components: {
    Editor: PrismEditor
  },
  props: {
    snippet: {},
    selectedSnippetIndex: Number
  },
  data: function() {
    return {
      langs: [
        "markup",
        "javascript",
        "csharp",
        "elixir",
        "python",
        "rust",
        "css",
        "java",
        "haskell"
      ],
      lineNumbers: true,
      readonly: false,
      snackbarDeleted: false,
      textDeleted: "Snippet deleted!",
      timeout: 2000
    };
  },
  methods: {
    // realtime syntax highlighting
    highlighter(code) {
      return highlight(
        code,
        {
          ...languages[this.snippet.lang]
        },
        this.snippet.lang
      );
    },
    deleteSnippet() {
      this.$emit("onDelete", this.snippet.id);
      this.snackbarDeleted = true;
    },
    // add to database
    async updateSnippet() {
      if (this.snippet.name.length >= 3) {
        this.$emit(
          "onUpdate",
          this.snippet.id,
          this.snippet.name,
          this.snippet.content,
          this.snippet.lang
        );
        this.snackbarSaved = true;
      } else {
        //
      }
    },
    async toggleFavorite(id, bool) {
      this.$emit("onToggleFavorite", this.snippet.id, bool);
      this.snippet.isFavorited = bool;
    },
    _saveListener(e) {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.keyCode === 83
      ) {
        e.preventDefault();
        this.updateSnippet();
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this._saveListener);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this._saveListener);
  }
};
</script>

<style lang="scss">
.editor {
  background-color: #1e1e1e;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 1.25rem;
  padding-top: 1rem;
  line-height: 1.5;
  height: calc(100vh - 176px);
}
.prism-editor__textarea:focus {
  outline: none;
}

.v-parallax__image {
  transform: translate(-50%, 0px) !important;
}
</style>