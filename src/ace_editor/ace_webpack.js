// Arquivo central para carregar o Ace editor em bundlers ESM.

import * as __ace from 'ace-builds/src-min-noconflict/ace.js';
import * as __langtools from 'ace-builds/src-min-noconflict/ext-language_tools.js';
// import * as __emmet from 'ace-builds/src-noconflict/ext-emmet.js'; // Emmet afeta o autocomplete mas parece que não é usado
import * as __portugolMode from "./mode-portugol.js";
import * as __portugolTheme from "./theme-portugol_dark.js";

const ace = window.ace;
if(!ace) {
    console.error("Erro ao carregar o Ace Editor. O objeto 'ace' não está disponível no escopo global.");
    throw new Error("Ace Editor não encontrado.");
}
// ace.config.set('basePath','node_modules/ace-builds/src-min-noconflict/');
console.log("Ace Carregado.");
export default ace;