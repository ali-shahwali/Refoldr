<template>
  <div>
    <editor
      :key="editorKey"
      @input="fieldUpdate"
      class="editor"
      v-model="snippet.content"
      @init="editorInit(editorTheme, snippet.lang)"
      :lang="snippet.lang"
      :theme="theme"
      width="100%"
      height="100vh"
      :options="{
        useWorker: false,
        selectionStyle: 'text',
        enableLiveAutocompletion: true,
        fontSize: '1.15rem',
        highlightSelectedWord: true,
        fadeFoldWidgets: true,
        showPrintMargin: false,
        highlightActiveLine: false,
        scrollPastEnd: 0.2
      }"
    />
    <div style="position: fixed; top: 30px; right: 35px">
      <v-btn
          v-if="pendingSave"
          class="mr-4"
          icon
          disabled
          loading
          x-small
          right
      />
      <v-btn
          class="mr-4"
          v-else
          disabled
          text
          small
          color="white">
        <v-icon left>mdi-content-save</v-icon>Saved
      </v-btn>
    </div>
    <div style="position: fixed; bottom: 40px; right: 35px">
      <v-row>
        <v-col cols="2">
          <v-menu
              top
              content-class="elevation-0"
              rounded
              offset-y
              :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <v-badge
                  :value="langHover"
                  transition="slide-x-transition"
                  icon="mdi-code-tags"
                  offset-x="58"
                  offset-y="18"
              >
                <v-hover v-model="langHover">
                  <v-btn
                      class="mr-12"
                      icon
                      x-large
                      v-on="on"
                  >
                    <v-avatar
                        rounded
                        size="35"
                        style="height: 35px; width: 35px;"
                    >
                      <v-img :src="getLangSvg(snippet.lang)"></v-img>
                    </v-avatar>

                  </v-btn>
                </v-hover>
              </v-badge>
            </template>
              <v-autocomplete
                  @input="fieldUpdate"
                  @change="editorKey += 1"
                  v-model="snippet.lang"
                  :items="langs"
                  class="mt-5"
                  solo
                  filled
                  label="Language"
                  menu-props="auto offsetY"
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
          </v-menu>
        </v-col>
        <v-col cols="10">
          <v-text-field
              @input="fieldUpdate"
              placeholder="Min 3 characters"
              v-model="snippet.name"
              rounded
              solo-inverted
              spellcheck="false"
          />
        </v-col>
      </v-row>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-if="snippet.isFavorited"
              class="mr-4"
              @click="toggleFavorite(snippet, false)"
              v-bind="attrs"
              v-on="on"
              color="#F2C14E"
              fab
          >
            <v-icon color="white">mdi-star</v-icon>
          </v-btn>
          <v-btn
              v-else
              class="mr-4"
              @click="toggleFavorite(snippet, true)"
              v-bind="attrs"
              v-on="on"
              color="#99959B"
              fab
          >
            <v-icon color="white">mdi-star-outline</v-icon>
          </v-btn>
        </template>
        <span>Favorite</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              class="mr-4"
              v-bind="attrs"
              v-on="on"
              @click="copySnippetToClipboard()"
              color="#87B6E1"
              fab
          >
            <v-icon color="white">
              mdi-content-copy
            </v-icon>
          </v-btn>
        </template>
        <span>Copy to clipboard</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              class="mr-4"
              link
              :to="{ name: 'SharedSnippet', params: { id: snippet.id } }"
              target="_blank"
              v-bind="attrs"
              v-on="on"
              fab
              color="#8790D9"
          >
            <v-icon color="white">mdi-share</v-icon>
          </v-btn>
        </template>
        <span>Share</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              class="mr-3"
              v-bind="attrs"
              v-on="on"
              @click.stop="drawerOpen = !drawerOpen"
              fab
              color="#5948D5"
          >
            <v-icon color="white">
              mdi-cog
            </v-icon>
          </v-btn>
        </template>
        <span>Editor settings</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
              @click="dialogDelete = true"
              fab
              color="#D7263D">
            <v-icon color="white">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </div>
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
    <v-navigation-drawer
      hide-overlay
      absolute
      temporary
      right
      width="350px"
      v-model="drawerOpen"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title>
            Editor Settings
          </v-list-item-title>
        </v-list-item>
        <v-divider class="mb-5"></v-divider>
        <div class="pa-4">
          <v-list-item>
            <v-autocomplete
                @change="setEditorTheme(theme)"
                v-model="theme"
                :items="themes"
                menu-props="auto"
                filled
                solo
                hint="Set editor theme"
                persistent-hint
                item-text="theme"
                item-value="value"
                spellcheck="false"
            >
              <template v-slot:selection="data">
                <v-icon class="mr-4" color="indigo" small v-if="data.item.type === 'dark'">mdi-moon-waning-crescent</v-icon>
                <v-icon class="mr-4" small v-else>mdi-white-balance-sunny</v-icon>
                {{ data.item.theme }}
              </template>
              <template v-slot:item="data">
                <template>
                  <v-icon class="mr-4" color="indigo" small v-if="data.item.type === 'dark'">mdi-moon-waning-crescent</v-icon>
                  <v-icon class="mr-4" small v-else>mdi-white-balance-sunny</v-icon>
                  <v-list-item-content>
                    <v-list-item-title
                        v-html="data.item.theme"
                    ></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-list-item>
          <v-divider class="mb-5 mt-5"></v-divider>
          <v-list-item>
            <v-list-item-content>
            <v-autocomplete
              @change="setPreferredLang(preferredLang)"
              v-model="preferredLang"
              :items="langs"
              menu-props="auto"
              filled
              solo
              hint="Set preferred language"
              persistent-hint
              item-text="name"
              item-value="value"
              spellcheck="false"
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
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Editor from "vue2-ace-editor";
import { supportedLangs, getLangSvg } from "../assets/langs";
import store from "../store";
import { mapMutations, mapGetters } from "vuex";
import { debounce } from "debounce";
import { init, themes } from "../assets/editor";

export default {
  name: "Snippet",
  components: {
    editor: Editor
  },
  computed: {
    editorTheme() {
      return store.state.theme.editorTheme;
    },
    ...mapGetters({ editorSettings: "editorSettings" }),
    ...mapGetters({ siteTheme: "theme" })
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    editorTheme(newTheme, oldTheme) {
      this.theme = newTheme;
      this.editorKey += 1;
    }
  },
  props: {
    snippet: {},
    selectedSnippetIndex: Number
  },
  data: function() {
    return {
      langs: supportedLangs,
      lineNumbers: true,
      drawerOpen: null,
      theme: "",
      preferredLang: "",
      themes: themes,
      snackbarDeleted: false,
      dialogDelete: false,
      snackbarCopied: false,
      textDeleted: "Snippet deleted!",
      timeout: 2000,
      pendingSave: false,
      state: "loading",
      firstLoad: false,
      editorKey: 0,
      langHover: false,
    };
  },
  methods: {
    editorInit: init,
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
          this.snippet
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
    async toggleFavorite(snippet, bool) {
      this.$emit("onToggleFavorite", this.snippet, bool);
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
    getLangSvg,
    ...mapMutations({ setEditorTheme: "SET_EDITOR_THEME" }),
    ...mapMutations({ setPreferredLang: "SET_PREFERRED_LANG" }),
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
    this.theme = this.siteTheme.editorTheme;
    this.preferredLang = this.editorSettings.preferredLang;
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

.v-menu__content {
}
</style>