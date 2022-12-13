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

describe("parser",() => {

    test("Parse programa Hello World:", () => {
        let erroCounter = {value:0};

        let input = "programa{ funcao inicio(){escreva(\"Olá Mundo\")} }";
        let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter));
        let tokens = tokenizer.tokenize();

        let parser = new Parser(tokenizer.getRelevantTokens(),input,erroCounterFn(erroCounter));
        let tree = parser.parse();

        expect(erroCounter.value).toBe(0);
    });
});
