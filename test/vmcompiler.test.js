/* eslint-env node, jest */

import { Compiler } from '../src/compiler/vmcompiler.js';
import { Parser } from '../src/compiler/parser.js';
import { Tokenizer } from '../src/compiler/tokenizer.js';
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


describe("Testando VmCompiler", () => {

    test("Compilar programa Hello World:", () => {
        let erroCounter = {value:0};

        let input = "programa{ funcao inicio(){escreva(\"Olá Mundo\")} funcao teste() { } }";
        let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter));
        tokenizer.tokenize();

        let tokens = tokenizer.getRelevantTokens();

        let parser = new Parser(tokens,input,erroCounterFn(erroCounter));
        let tree = parser.parse();

        let compiler = new Compiler(tree,[],tokens,input,null,erroCounterFn(erroCounter));
        compiler.compile();

        expect(erroCounter.value == 0 && compiler.getFuncIndex("teste",[]) != -1).toBe(true);
    });
});