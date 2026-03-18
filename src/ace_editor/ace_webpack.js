// Arquivo necessário para utilizar o webpack para concatenar arquivos necessários do Ace editor

/*
import * as __ace from '../../lib/src-min-noconflict/ace.js';
import * as __langtools from '../../lib/src-min-noconflict/ext-language_tools.js';
import * as __emmet from '../../lib/src-min-noconflict/ext-emmet.js';
import * as __portugolmode from '../../lib/src-min-noconflict/mode-portugol.js';
import * as __portugoltheme from '../../lib/src-min-noconflict/theme-portugol_dark.js';
*/

import * as __ace from 'ace-builds/src-min-noconflict/ace.js';
import * as __langtools from 'ace-builds/src-min-noconflict/ext-language_tools.js';
import * as __emmet from 'ace-builds/src-min-noconflict/ext-emmet.js';

const ace = window.ace;
ace.config.set('basePath','node_modules/ace-builds/src-noconflict/');
console.log("Ace Carregado.");

export default ace;