/**
 * 
 * Objetivo: Traduzir os textos do context-menu da biblioteca Ace sem editar os arquivos diretamente
 * Executar este script sempre que atualizar a biblioteca
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// https://stackoverflow.com/questions/10045122/replace-many-values-in-a-string-based-on-search-replace-pairs
function special_replace(string_input, obj_replace_dictionary) {
    // Construct a RegEx from the dictionary
    let pattern = [];
    for (let name of Object.keys(obj_replace_dictionary)) {
        // Escape characters
        pattern.push(escapeRegExp(name));
    }

    // Concatenate keys, and create a Regular expression:
    pattern = new RegExp( pattern.join('|'), 'g' );

    // Call String.replace with a regex, and function argument.
    return string_input.replace(pattern, function(match) {
        return obj_replace_dictionary[match];
    });
}

const bibliotecaAcePath = "./lib/ace-src-min-noconflict/";
let acejs_txt = readFileSync(bibliotecaAcePath+"ace.js", {encoding: "utf8"});
acejs_txt = special_replace(acejs_txt, {
// Funciona porque faz o match das aspas e a letra maiúscula
"\"Copy\"":"\"Copiar\"", 
"\"Paste\"":"\"Colar\"",
"\"Cut\"":"\"Recortar\"",
"\"Undo\"":"\"Desfazer\"",
"\"Find\"":"\"Pesquisar\"",
"\"Pallete\"":"\"Opções\"",
"\"Select All\"":"\"Selec Tudo\"",
});


writeFileSync(bibliotecaAcePath+"ace.js", acejs_txt, {encoding: "utf8"});


