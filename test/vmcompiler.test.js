import { Compiler, checarCompatibilidadeTipo } from '../src/compiler/vmcompiler.js';
import { Parser } from '../src/compiler/parser.js';
import { T_bitnot, T_inteiro, T_logico, T_real, Tokenizer } from '../src/compiler/tokenizer.js';
//import { assert, assertEquals, test, testAll } from './test.js';

import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

function erroCounterFn(counterRef) {
    return (input,token,msg,tipo) => {
        counterRef.value++;
    };
}

describe("Testando VmCompiler", () => {
    function doCompile(input) {
        let erroCounter = {value:0};
        let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter));
        let allTokens = tokenizer.tokenize();

        let tokens = tokenizer.getRelevantTokens();

        let parser = new Parser(tokens,allTokens,input,erroCounterFn(erroCounter));
        let tree = parser.parse();

        let compiler = new Compiler(tree,[],tokens,input,null,erroCounterFn(erroCounter));
        compiler.compile();

        return {
            tokens: tokens,
            tree: tree,
            compiler: compiler, 
            errors: erroCounter.value
        };
    }

    test("Operador bitnot só aceita inteiro ou lógico", () => {
        expect(checarCompatibilidadeTipo(T_inteiro,T_inteiro,T_bitnot)).toBe(true);
        expect(checarCompatibilidadeTipo(T_logico,T_logico,T_bitnot)).toBe(true);
        expect(checarCompatibilidadeTipo(T_real,T_real,T_bitnot)).toBe(false);
    });

    test("Compilar programa Hello World:", () => {
        const { tokens, tree, compiler, errors} = doCompile(`programa { 
            funcao inicio() 
            {
                escreva("Olá Mundo")
            }

            funcao teste() 
            { 

            } 
        }`);

        expect(errors == 0 && compiler.getFuncIndex("teste",[]) != -1).toBe(true);
    });

    test("Deve produzir erro leia com vetor ou matriz sem índice", () => {
        {
        const { tokens, tree, compiler, errors} = doCompile(`programa { 
            funcao inicio() 
            { 
                inteiro x[] = {1,2,3}
                leia(x) 
            }
        }`);

        expect(errors > 0).toBe(true);
        }

        {
        const { tokens, tree, compiler, errors} = doCompile(`programa { 
            funcao inicio() 
            { 
                inteiro x[] = {1,2,3}
                leia(x[0]) 
            }
        }`);

        expect(errors == 0 && compiler.getFuncIndex("inicio",[]) != -1).toBe(true);
        }
    });
});