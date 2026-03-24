import PortugolRuntime from "../src/compiler/vm/portugolrun.js";
import { VM_setExecJS } from "../src/compiler/vm/vm.js";
import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

function doExecCheckJS(input) {
    let lninput = input.replace(/\r\n/g,"\n");

    const ex_fim = lninput.lastIndexOf("---")-1;
    const ex_inicio = lninput.lastIndexOf("---",ex_fim)+4;
    const ex_txt = lninput.substring(ex_inicio,ex_fim);
    if(!ex_txt) throw new Error("Não tem o que o código deveria produzir");

    const run = new PortugolRuntime({value:""});
    run.escrever_tempo = false;
    run.iniciarBibliotecas(false,false,false,false,false);

    // Ativa modo JS (turbo)
    VM_setExecJS(true);

    const compilado = run.compilar(input,false,true); // mayCompileJS = true
    if(!compilado.success) throw new Error("Erro na compilação");

    // Verifica que o código JS foi gerado
    expect(compilado.jsgenerator.generatedCode).toBeTruthy();

    return run.executar(input,compilado,false).then((saida) => {
        if(!saida) return Promise.reject("Saída Vazia");
        expect(saida).toBe(ex_txt);
    }).finally(() => {
        // Restaurar para não afetar outros testes
        VM_setExecJS(false);
    });
}

function testExemploJS(exemplo) {
    test(exemplo+" [JS]",() => {
        return fetch("/exemplos/test/"+exemplo, {method:"GET"})
        .then((response) => {
            if (!response.ok) return Promise.reject(response.status);    
            return response.text();
        })
        .then((text) => {
            if(!text) return Promise.reject("Resposta Vazia");
            return doExecCheckJS(text);
        });
    }); 
}

describe("JsGenerator - Modo Turbo",() => {
    testExemploJS("olamundo.por");
    testExemploJS("fibonacci.por");
    testExemploJS("autoincremento.por");
    testExemploJS("operadores.por");
    testExemploJS("divisao.por");
    testExemploJS("fatorialrecursivo.por");
    testExemploJS("notacao_cientifica.por");
    testExemploJS("escolha.por");
    testExemploJS("logico_array_default.por");
    testExemploJS("bibli_matematica.por");
    testExemploJS("bibli_texto.por");
    testExemploJS("bibli_tipos.por");
    testExemploJS("xor_logico.por");
    testExemploJS("vetorescape.por");
    testExemploJS("primos.por");
    testExemploJS("tabuada.por");
    testExemploJS("byref_retorno.por");
    testExemploJS("bibli_calendario.por");

    testExemploJS("faca_enquanto.por");       // STATEMENT_facaEnquanto (do-while)
    testExemploJS("matriz_literal.por");      // compileDeclArray fix: [[a,b],[c,d]]
    testExemploJS("variaveis_globais.por");   // globais via closure no novo escopo
    testExemploJS("aguarde.por");             // biblioteca nao-jsSafe via promisify
    testExemploJS("sobrecarga_tipo.por");     // getJsSafe fix: sobrecargas mesmo num. params
});
