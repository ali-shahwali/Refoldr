<template>
  <div>
    <v-toolbar>
      <v-text-field
        @input="fieldUpdate"
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
        @input="fieldUpdate"
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
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
      <div class="ml-4">
        <v-btn
          v-if="pendingSave"
          class="mr-2"
          icon
          disabled
          loading
          x-small
          right
        ></v-btn>
        <v-btn v-else disabled text small color="white"
          ><v-icon left>mdi-content-save</v-icon>Saved
        </v-btn>
      </div>
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
          <v-btn
            link
            :to="{ name: 'SharedSnippet', params: { id: snippet.id } }"
            target="_blank"
            v-bind="attrs"
            v-on="on"
            icon
            color="primary"
          >
            <v-icon>mdi-share</v-icon>
          </v-btn>
        </template>
        <span>Share</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="dialogDelete = true" icon>
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </v-toolbar>

    <editor
      @input="fieldUpdate"
      class="editor"
      v-if="selectedSnippetIndex !== undefined"
      v-model="snippet.content"
      @init="editorInit"
      :lang="snippet.lang"
      theme="dracula"
      width="100%"
      height="calc(100vh - 176px)"
      :options="{
        useWorker: false,
        selectionStyle: 'text',
        enableLiveAutocompletion: true,
        fontSize: '1.15rem',
        highlightSelectedWord: true,
        fadeFoldWidgets: true,
        showPrintMargin: false,
        highlightActiveLine: false,
      }"
    ></editor>

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

    <v-dialog v-model="dialogDelete" max-width="30vw">
      <v-card>
        <v-card-actions>
          <v-card-title class="headline">
            Are you sure?
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-4"
            color="primary"
            text
            @click="dialogDelete = false"
          >
            No, Cancel
          </v-btn>
          <v-btn color="error" @click="deleteSnippet()">
            <v-icon left>mdi-delete</v-icon>
            Yes, Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Editor from "vue2-ace-editor";
import { supportedLangs } from "../assets/langs";
import { debounce } from "debounce";

export default {
  name: "Snippet",
  components: {
    editor: Editor
  },
  props: {
    snippet: {},
    selectedSnippetIndex: Number
  },
  data: function() {
    return {
      langs: supportedLangs,
      lineNumbers: true,
      readonly: false,
      snackbarDeleted: false,
      dialogDelete: false,
      snackbarCopied: false,
      textDeleted: "Snippet deleted!",
      timeout: 2000,
      pendingSave: false,
      state: "loading",
      firstLoad: false
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
      require("brace/mode/erlang");
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
      require("brace/mode/ruby");
      require("brace/mode/kotlin");
      require("brace/mode/ocaml");
      require("brace/mode/dart");
      require("brace/mode/perl");
      require("brace/mode/julia");
      require("brace/theme/dracula");
    },
    deleteSnippet() {
      this.$emit("onDelete", this.snippet.id);
      this.snackbarDeleted = true;
      this.dialogDelete = false;
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
        this.pendingSave = false;
      } else {
        //
      }
    },
    fieldUpdate() {
      if (!this.firstLoad) {
        this.state = "modified";
        this.pendingSave = true;
        this.debouncedUpdate();
      } else {
        this.firstLoad = false;
      }
    },
    debouncedUpdate: debounce(function() {
      this.updateSnippet();
    }, 1000),
    async toggleFavorite(id, bool) {
      this.$emit("onToggleFavorite", this.snippet.id, bool);
      this.snippet.isFavorited = bool;
    },
    copySnippetToClipboard() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.snippet.content;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbarCopied = true;
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
.v-parallax__image {
  transform: translate(-50%, 0px) !important;
}
</style>