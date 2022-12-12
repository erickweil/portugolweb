import { Compiler } from '../js/compiler/vmcompiler.js';
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
return testAll("vmcompiler",

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

        assert(erroCounter.value == 0 && compiler.getFuncIndex("teste",[]) != -1);
    })

);
}