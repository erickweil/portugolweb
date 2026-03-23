import portugolCompleter from "../../ace_editor/ace_portugol_completer.js";
export default class EditorManager {

    constructor() {

    }

    async initEditor(divID,fontSize,libraries,isMobile,editorFocusCallback) {
        const { default: ace } = await import("../../ace_editor/ace_webpack.js");
        this.Range = ace.default.require("ace/range").Range;

        this.fontSize = fontSize;
        this.editor_divID = divID;
        this.editor = ace.edit(divID,{
            minLines: 10,
            fontSize: fontSize+"pt",
            useSoftTabs: false,
            navigateWithinSoftTabs: false
        }
        );
        this.editor.setTheme("ace/theme/portugol_dark");
        this.editor.session.setMode("ace/mode/portugol");

        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true, // negócio chato demais, tenho que fazer ficar mais intuitivo antes de ativar
            enableLiveAutocompletion: true,
            enableMobileMenu: false, // três pontinhos inúteis
            scrollPastEnd: 0.5
        });

        this.myPortugolCompleter = new portugolCompleter(libraries);
        this.aceLangTools = ace.require('ace/ext/language_tools');
        //this.aceLangTools.setCompleters();		
        this.aceLangTools.addCompleter(this.myPortugolCompleter);
        
        

        this.editor.commands.on("afterExec", (e) => {
            if (e.command.name == "insertstring" && /^[\.]$/.test(e.args)) {
                this.editor.execCommand("startAutocomplete");
            }
        });

        // A quer saber vamos ativar os números de linhas no mobile né
        //if(isMobile)
        //{
        //    this.editor.renderer.setShowGutter(false);
        //}

        this.editor.on("focus", editorFocusCallback);
        this.editor.focus();

        this.errosMarkers = [];
        this.errosAnnot = [];
    }



    setAutoCompleterState(checked)
	{
		this.editor.setOptions({ 
            enableBasicAutocompletion: checked, 
            enableLiveAutocompletion: checked 
        });
	}

    getValue() {
        return this.editor.getValue();
    }

    setValue(codigo) {
        this.editor.setValue(codigo,-1);// move cursor ao início
    }

    focus() {
        this.editor.focus();
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.editor.setOptions({
			fontSize: fontSize+"pt"
		});
    }

    setGutterState(show) {
        this.editor.renderer.setShowGutter(show);
        this.editor.resize();
    }

    getGutterState() {
        return this.editor.renderer.getShowGutter();
    }

    /**
        //var KEY_MODS= {
        //    "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
        //    "super": 8, "meta": 8, "command": 8, "cmd": 8
        //};
            FUNCTION_KEYS : {
        8  : "Backspace",
        9  : "Tab",
        13 : "Return",
        19 : "Pause",
        27 : "Esc",
        32 : "Space",
        33 : "PageUp",
        34 : "PageDown",
        35 : "End",
        36 : "Home",
        37 : "Left",
        38 : "Up",
        39 : "Right",
        40 : "Down",
        44 : "Print",
        45 : "Insert",
        46 : "Delete",
        96 : "Numpad0",
        97 : "Numpad1",
        98 : "Numpad2",
        99 : "Numpad3",
        100: "Numpad4",
        101: "Numpad5",
        102: "Numpad6",
        103: "Numpad7",
        104: "Numpad8",
        105: "Numpad9",
        '-13': "NumpadEnter",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "Numlock",
        145: "Scrolllock"
    },

    */
    editorCommand(keycode) {
        this.editor.onCommandKey({}, 0, keycode);
    }

    undo() {
        this.editor.undo();
    }

    redo() {
        this.editor.redo();
    }

    autoComplete() {
        this.editor.execCommand('startAutocomplete');
    }

    editorType(c) {
        this.editor.onTextInput(c);
    }

    updateAutoComplete(compilado) {
        this.myPortugolCompleter.setCompiler(compilado);
    }

    /** MARCAÇÕES E REALCES */
    removeMarkers() {
        for(let i=0;i<this.errosMarkers.length;i++)
		{
			this.editor.getSession().removeMarker(this.errosMarkers[i]);
		}
		this.errosMarkers = [];
    }

    removeAnnotations() {
        this.errosAnnot = [];
        this.editor.getSession().setAnnotations(this.errosAnnot);
    }

    getAnnotations(ignoreType) {
        // apaga os erros e re-envia os que nao é para apagar
        let retAnnot = [];
        for(let i=0;i<this.errosAnnot.length;i++)
        {
            if(!ignoreType.includes(this.errosAnnot[i].myErrorType) && this.errosAnnot[i].type == "error")
            {
                retAnnot.push(this.errosAnnot[i]);
            }
        }

        return retAnnot;
    }

    errMarker(annot) {
        if(!annot) return;
		
		this.errosAnnot.push(annot);
		this.editor.getSession().setAnnotations(this.errosAnnot);
		
		this.errosMarkers.push(
            this.editor.getSession().addMarker(new this.Range(
                    annot.row, 
                    0, 
                    annot.row, 
                    annot.columnFim),'ace_erroportugol-marker', 'screenLine')
        );
    }

    highlight(linha,coluna,colunaFim,scrollTo) {
        // Coloca um 'i' no gutter
        this.errosAnnot.push({
			row: linha-1,
			column: coluna,
			text: "", // Or the Json reply from the parser 
			type: "info" // also warning, error and security
		});
		this.editor.getSession().setAnnotations(this.errosAnnot);

        // Coloca um realce na linha inteira
		this.errosMarkers.push(
            this.editor.getSession()
            .addMarker(
                new this.Range(linha-1, 0, linha-1, colunaFim), 
                'ace_realceportugol-marker', 'screenLine'
        ));
		
		if(scrollTo)
		{
			this.editor.scrollToLine(linha, true, true, function () {});
		}
    }

    resizeEditor(height) {
        document.getElementById(this.editor_divID).style.height = height+"px";
		
        this.editor.resize();
    }
}