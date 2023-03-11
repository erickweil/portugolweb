/* eslint-env node, jest */

import { Tokenizer } from '../src/compiler/tokenizer.js';

//import { assert, assertEquals, test, testAll } from './test.js';

import { httpGetAsync } from '../src/extras/extras.js';

import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

function erroCounterFn(counterRef) {
    return (input,token,msg,tipo) => {
        console.log("Erro ",tipo," em ",token,":",msg);
        counterRef.value++;
    };
}

function tokenizerContarErros(input) {
    let erroCounter = {value:0};

    let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter));
    let tokens = tokenizer.tokenize();

    expect(erroCounter.value).toBe(0);
}

function testExemplo(exemplo) {
    test(exemplo,() => {
        return httpGetAsync("/exemplos/"+exemplo, (txt) => {
            tokenizerContarErros(txt);
        });
    });
}

//describe("Tokenizer", () => {

    describe("Programa Simples",() => {
        test("Tokenizer programa simples:", () => {
            tokenizerContarErros("programa{funcao inicio(){inteiro a = 4 escreva(\"Valor é\"+a)}");
        });
    });
    describe("Exemploss",() => {
        testExemplo("aleatorio0.por");
        testExemplo("aleatorio1.por");
        testExemplo("aleatorio2.por");
        testExemplo("aleatorio3.por");
        testExemplo("aleatorio5.por");
        testExemplo("bibliotecas.por");
        testExemplo("bolachaoumaca.por");
        testExemplo("branco.por");
        testExemplo("condicoes.por");
        testExemplo("entrada.por");
        testExemplo("funcoes.por");
        testExemplo("graficos.por");
        testExemplo("internet.por");
        testExemplo("jogodavida.por");
        testExemplo("notas.por");
        testExemplo("olamundo.por");
        testExemplo("repeticao.por");
        testExemplo("slide_puzzle.por");
        testExemplo("variaveis.por");
        testExemplo("velocidade.por");
        testExemplo("vetores.por");
    });
//});