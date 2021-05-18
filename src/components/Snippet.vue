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
          <v-btn v-bind="attrs" v-on="on" @click="dialogDelete = true" icon>
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </v-toolbar>

    <editor
      id="editor"
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
        displayIndentGuides: true,
        fontSize: '1.25rem',
        highlightSelectedWord: true,
        fadeFoldWidgets: true,
        showPrintMargin: false,
        highlightActiveLine: false
      }"
    ></editor>

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

    <v-dialog
        v-model="dialogDelete"
        max-width="30vw"
    >
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
          <v-btn
              color="error"
              @click="deleteSnippet()"
          >
            <v-icon left>mdi-delete</v-icon>
            Yes, Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      @click="copyToClipboard()"
      fab
      dark
      large
      color="primary"
      style="position: fixed; bottom: 70px; right: 20px"
    >
      <v-icon dark>
        mdi-content-copy
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import Editor from "vue2-ace-editor";

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
      langs: [
        {
          name: "HTML (markup)",
          value: "markup",
          avatar: require("@/assets/langs/markup.svg")
        },
        {
          name: "CSS",
          value: "css",
          avatar: require("@/assets/langs/css.svg")
        },
        {
          name: "JavaScript",
          value: "javascript",
          avatar: require("@/assets/langs/javascript.svg")
        },
        {
          name: "TypeScript",
          value: "typescript",
          avatar: require("@/assets/langs/typescript.svg")
        },
        {
          name: "C/C++",
          value: "c_cpp",
          avatar: require("@/assets/langs/c_cpp.svg")
        },
        {
          name: "C#",
          value: "csharp",
          avatar: require("@/assets/langs/csharp.svg")
        },
        {
          name: "Elixir",
          value: "elixir",
          avatar: require("@/assets/langs/elixir.svg")
        },
        {
          name: "Python",
          value: "python",
          avatar: require("@/assets/langs/python.svg")
        },
        {
          name: "Rust",
          value: "rust",
          avatar: require("@/assets/langs/rust.svg")
        },
        {
          name: "Java",
          value: "java",
          avatar: require("@/assets/langs/java.svg")
        },
        {
          name: "Haskell",
          value: "haskell",
          avatar: require("@/assets/langs/haskell.svg")
        },
        { name: "R", value: "r", avatar: require("@/assets/langs/r.svg") },
        {
          name: "PHP",
          value: "php",
          avatar: require("@/assets/langs/php.svg")
        },
        {
          name: "Go",
          value: "golang",
          avatar: require("@/assets/langs/golang.svg")
        },
        {
          name: "Swift",
          value: "swift",
          avatar: require("@/assets/langs/swift.svg")
        },
        {
          name: "JSX (React)",
          value: "jsx",
          avatar: require("@/assets/langs/jsx.svg")
        },
        {
          name: "SQL",
          value: "sql",
          avatar: require("@/assets/langs/sql.svg")
        },
        {
          name: "MySQL",
          value: "mysql",
          avatar: require("@/assets/langs/mysql.svg")
        },
        {
          name: "SQL Server",
          value: "sqlserver",
          avatar: require("@/assets/langs/sqlserver.svg")
        }
      ],
      lineNumbers: true,
      readonly: false,
      snackbarDeleted: false,
      dialogDelete: false,
      snackbarCopied: true,
      textDeleted: "Snippet deleted!",
      timeout: 2000
    };
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/ext/static_highlight");
      require("brace/ext/textarea");
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
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
        this.snackbarSaved = true;
      } else {
        //
      }
    },
    async toggleFavorite(id, bool) {
      this.$emit("onToggleFavorite", this.snippet.id, bool);
      this.snippet.isFavorited = bool;
    },
    copyToClipboard() {
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