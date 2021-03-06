// this file contains all languages supported by refoldr
export const supportedLangs = [
    {
        name: "HTML (markup)",
        value: "html",
        avatar: require("@/assets/langs/html.svg")
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
        name: "Erlang",
        value: "erlang",
        avatar: require("@/assets/langs/erlang.svg")
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
        name: "Kotlin",
        value: "kotlin",
        avatar: require("@/assets/langs/kotlin.svg")
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
    },
    {
        name: "MATLAB",
        value: "matlab",
        avatar: require("@/assets/langs/matlab.svg")
    },
    {
        name: "Ruby",
        value: "ruby",
        avatar: require("@/assets/langs/ruby.svg")
    },
    {
        name: "OCaml",
        value: "ocaml",
        avatar: require("@/assets/langs/ocaml.svg")
    },
    {
        name: "Dart",
        value: "dart",
        avatar: require("@/assets/langs/dart.svg")
    },
    {
        name: "Perl",
        value: "perl",
        avatar: require("@/assets/langs/perl.svg")
    },
    {
        name: "Julia",
        value: "julia",
        avatar: require("@/assets/langs/julia.svg")
    },
];

export const getLangSvg = (lang) =>  {
    if (lang !== null) return require(`@/assets/langs/${lang}.svg`);
    else return require("@/assets/langs/placeholder.svg");
}