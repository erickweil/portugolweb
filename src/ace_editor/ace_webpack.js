// Arquivo necessário para utilizar o webpack para concatenar arquivos necessários do Ace editor

import * as __ace from '../../lib/ace-src-min-noconflict/ace.js';
import * as __langtools from '../../lib/ace-src-min-noconflict/ext-language_tools.js';
import * as __emmet from '../../lib/ace-src-min-noconflict/ext-emmet.js';
import * as __portugolmode from '../../lib/ace-src-min-noconflict/mode-portugol.js';
import * as __portugoltheme from '../../lib/ace-src-min-noconflict/theme-portugol_dark.js';

console.log("Ace Carregado.");