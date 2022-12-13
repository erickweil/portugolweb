/* eslint-env node, jest */

import { httpGetAsync } from "../src/extras/extras.js";
import PortugolRuntime from "../src/compiler/vm/portugolrun.js";
//import { assert, assertEquals, test, testAll } from './test.js';
import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

function erroCounterFn(counterRef) {
    return (input,token,msg,tipo) => {
        console.log("Erro ",tipo," em ",token,":",msg);
        counterRef.value++;
    };
}

function doExecCheck(input) {

    // Para pegar o output padrão só
    // Não precisa mais fazer isso no código.
    let lninput = input.replace(/\r\n/g,"\n");

    const ex_fim = lninput.lastIndexOf("---")-1;
    const ex_inicio = lninput.lastIndexOf("---",ex_fim)+4;
    const ex_txt = lninput.substring(ex_inicio,ex_fim);
    if(!ex_txt) throw "Não tem o que o código deveria produzir";
    //assert(ex_txt != false);


    const run = new PortugolRuntime({value:""});
    run.escrever_tempo = false;

    const compilado = run.compilar(input,false,false);
    //assert(compilado.success);
    if(!compilado.success) throw "Erro na compilação";

    return run.executar(input,compilado,false).then((saida) => {
        if(!saida) return Promise.reject("Saída Vazia");

        expect(saida).toBe(ex_txt);
    });
}

function testExemplo(exemplo) {
    test(exemplo,() => {
        return fetch("/test/programas/"+exemplo, {method:"GET"})
        .then((response) => {
            if (!response.ok) return Promise.reject(response.status);    

            return response.text();
        })
        .then((text) => {
            if(!text) return Promise.reject("Resposta Vazia");

            return doExecCheck(text);
        });
    }); 
}


describe("PortugolRuntime",() => {
    testExemplo("olamundo.por");
    testExemplo("fibonacci.por");
    testExemplo("primos.por");
    testExemplo("autoincremento.por");
    testExemplo("vetorescape.por");
    testExemplo("operadores.por");
});