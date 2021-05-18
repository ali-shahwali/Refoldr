<template>
  <div>
    <v-toolbar v-if="selectedSnippetIndex !== undefined">
      <v-text-field
        dense
        solo
        class="mt-6"
        label="Title"
        placeholder="Min 3 characters"
        v-model="snippet.name"
        style="max-width: 450px;"
        spellcheck="false"
      ></v-text-field>
      <v-autocomplete
              style="max-width: 300px;"
              v-model="snippet.lang"
              :items="langs"
              dense
              solo
              class="mt-6 ml-5"
              label="Language"
              menu-props="auto"
              spellcheck="false"
              item-text="name"
              item-value="name"
            >
            <template v-slot:selection="data">
                  <v-avatar size="small" style="height: 20px; width: 20px;" class="mr-2" left>
                    <v-img :src="data.item.avatar"></v-img>
                  </v-avatar>
                  {{ data.item.name }}
              </template>
              <template v-slot:item="data">
                <template>
                  <v-list-item-avatar size="small" style="height: 20px; width: 20px;">
                    <img :src="data.item.avatar">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="updateSnippet" icon>
            <v-icon color="primary">mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span> <v-icon left small>mdi-microsoft-windows</v-icon>CTRL + S</span
        ><br />
        <span><v-icon left small>mdi-apple</v-icon>CMD + S</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="snippet.isFavorited"
            @click="toggleFavorite(snippet.id, false)"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="yellow darken-3">mdi-star</v-icon>
          </v-btn>
          <v-btn
            v-else
            @click="toggleFavorite(snippet.id, true)"
            v-bind="attrs"
            v-on="on"
            icon
          >
            <v-icon color="grey lighten-1">mdi-star-outline</v-icon>
          </v-btn>
        </template>
        <span>Favorite</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="deleteSnippet" icon>
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
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
    <v-parallax
      translate="false"
      src="../assets/SnippetMissingBG.svg"
      style="height: calc(100vh - 113px)"
      v-else
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

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';


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
        { name: "HTML (markup)", avatar: require('@/assets/langs/html.svg')},
        { name: "CSS", avatar: require('@/assets/langs/css.svg')},
        { name: "JavaScript", avatar: require('@/assets/langs/js.svg')},
        { name: "TypeScript", avatar: require('@/assets/langs/ts.svg')},
        { name: "C", avatar: require('@/assets/langs/c.svg')},
        { name: "C++", avatar: require('@/assets/langs/cpp.svg')},
        { name: "C#", avatar: require('@/assets/langs/csharp.svg')},
        { name: "Elixir", avatar: require('@/assets/langs/elixir.svg')},
        { name: "Python", avatar: require('@/assets/langs/python.svg')},
        { name: "Rust", avatar: require('@/assets/langs/rust.svg')},
        { name: "Java", avatar: require('@/assets/langs/java.svg')},
        { name: "Haskell", avatar: require('@/assets/langs/haskell.svg')},
        { name: "R", avatar: require('@/assets/langs/r.svg')},
        { name: "PHP", avatar: require('@/assets/langs/php.svg')},
        { name: "Go", avatar: require('@/assets/langs/go.svg')},
        { name: "Swift", avatar: require('@/assets/langs/swift.svg')},
        { name: "JSX (React)", avatar: require('@/assets/langs/jsx.svg')},
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
      let lang = this.snippet.lang;
      if(lang === "C#")
        lang = "csharp";
      else if(lang === "HTML (markup)")
        lang = "markup";
      else if(lang === "C++")
        lang = "cpp";
      else if(lang === "JSX (React)")
        lang = "jsx";

      return highlight(
        code,
        {
          ...languages[lang.toLocaleLowerCase()]
        },
        lang
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