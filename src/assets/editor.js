
export const themes = [
  {
    theme: "Chrome",
    value: "chrome",
    type: "light"
  },
  {
    theme: "Clouds",
    value: "clouds",
    type: "light"
  },
  {
    theme: "Crimson",
    value: "crimson_editor",
    type: "light"
  },
  {
    theme: "Dawn",
    value: "dawn",
    type: "light"
  },
  {
    theme: "Dreamweaver",
    value: "dreamweaver",
    type: "light"
  },
  {
    theme: "Eclipse",
    value: "eclipse",
    type: "light"
  },
  {
    theme: "Github",
    value: "github",
    type: "light"
  },
  {
    theme: "IPlastic",
    value: "iplastic",
    type: "light"
  },
  {
    theme: "Solarized Light",
    value: "solarized_light",
    type: "light"
  },
  {
    theme: "Textmate",
    value: "textmate",
    type: "light"
  },
  {
    theme: "Tomorrow",
    value: "tomorrow",
    type: "light"
  },
  {
    theme: "Xcode",
    value: "xcode",
    type: "light"
  },
  {
    theme: "Kuroir",
    value: "kuroir",
    type: "light"
  },
  {
    theme: "KatzenMilch",
    value: "katzenmilch",
    type: "light"
  },
  {
    theme: "SQL Server",
    value: "sqlserver",
    type: "light"
  },
  {
    theme: "Ambiance",
    value: "ambiance",
    type: "dark"
  },
  {
    theme: "Chaos",
    value: "chaos",
    type: "dark"
  },
  {
    theme: "Clouds Midnight",
    value: "clouds_midnight",
    type: "dark"
  },
  {
    theme: "Dracula",
    value: "dracula",
    type: "dark"
  },
  {
    theme: "Cobalt",
    value: "cobalt",
    type: "dark"
  },
  {
    theme: "Gruvbox",
    value: "gruvbox",
    type: "dark"
  },
  {
    theme: "Green on Black",
    value: "gob",
    type: "dark"
  },
  {
    theme: "Idle Fingers",
    value: "idle_fingers",
    type: "dark"
  },
  {
    theme: "Kr Theme",
    value: "kr_theme",
    type: "dark"
  },
  {
    theme: "Merbivore",
    value: "merbivore",
    type: "dark"
  },
  {
    theme: "Merbivore soft",
    value: "merbivore_soft",
    type: "dark"
  },
  {
    theme: "Mono Industrial",
    value: "mono_industrial",
    type: "dark"
  },
  {
    theme: "Monokai",
    value: "monokai",
    type: "dark"
  },
  {
    theme: "Pastel on Dark",
    value: "pastel_on_dark",
    type: "dark"
  },
  {
    theme: "Solarized Dark",
    value: "solarized_dark",
    type: "dark"
  },
  {
    theme: "Terminal",
    value: "terminal",
    type: "dark"
  },
  {
    theme: "Tomorrow Night",
    value: "tomorrow_night",
    type: "dark"
  },
  {
    theme: "Tomorrow Night Blue",
    value: "tomorrow_night_blue",
    type: "dark"
  },
  {
    theme: "Tomorrow Night Bright",
    value: "tomorrow_night_bright",
    type: "dark"
  },
  {
    theme: "Tomorrow Night 80s",
    value: "tomorrow_night_eighties",
    type: "dark"
  },
  {
    theme: "Twilight",
    value: "twilight",
    type: "dark"
  },
  {
    theme: "Vibrant Ink",
    value: "vibrant_ink",
    type: "dark"
  }
];

export function init(theme, lang) {
  // if autocomplete is left empty
  if(lang === null)
    lang = "javascript";

  require("brace/ext/language_tools");
  require("brace/theme/chrome");
  require(`brace/mode/${lang}`);
  require(`brace/theme/${theme}`);
}