import { Parser } from '../js/compiler/parser.js';
import { Tokenizer } from '../js/compiler/tokenizer.js';
import { assert, assertEquals, test, testAll } from './test.js';

function erroCounterFn(counterRef) {
    return (input,token,msg,tipo) => {
        console.log("Erro ",tipo," em ",token,":",msg);
        counterRef.value++;
    };
}

export function runTests() {
return testAll("parser",

    test("Parse programa Hello World:", () => {
        let erroCounter = {value:0};

        let input = "programa{ funcao inicio(){escreva(\"Olá Mundo\")} }";
        let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter));
        let tokens = tokenizer.tokenize();

        let parser = new Parser(tokenizer.getRelevantTokens(),input,erroCounterFn(erroCounter));
        let tree = parser.parse();

        assert(erroCounter.value == 0);
    })
);
}