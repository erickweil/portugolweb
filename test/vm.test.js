import { T_vazio } from '../src/compiler/tokenizer.js';
import * as vm from '../src/compiler/vm/vm.js';

//import { assert, assertEquals, test, testAll } from './test.js';
import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

describe("Testando VM", () => {

    test("Formatar real em notação científica mantém decimal válido", () => {
        // com float igual js
        expect(vm.VM_f2s(3.33333333)).toBe("3.33333333");
        expect(vm.VM_f2s(1)).toBe("1.0");
        expect(vm.VM_f2s(1e-7)).toBe("1e-7");
        expect(vm.VM_f2s(1e21)).toBe("1e+21");

        // com inteiros fica fullwidth
        expect(vm.VM_i2s(1e21)).toBe("1000000000000000000000");
    });

    test("Testando Declarar Array", () => {
        let arr = vm.recursiveDeclareArray([3,3],1,0);
        expect(arr).toStrictEqual([[1,1,1],[1,1,1],[1,1,1]]);
    });

    test("Executar Hello World via bytecode direto:", () => {
        let saida = {value:"",scrollTop:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:
                [
                    vm.B_PUSH,
                    "Hello World",
                    vm.B_INVOKE,
                    1,
                    1,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            },
            {
                name:"escreva",
                bytecode:[
                    vm.B_LOAD,0,
                    vm.B_WRITE,
                    vm.B_RET
                ],
                varCount:1,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            },
        ],false,false,false,10,"",saida,false);

        vm.VMrun(10000);

        expect(saida.value).toBe("Hello World");
    });

    test("Retorno com valor restaura o frame chamador", () => {
        let saida = {value:"",scrollTop:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_INVOKE, 1, 0,
                    vm.B_STORE, 0,
                    vm.B_LOAD, 0,
                    vm.B_INVOKE, 2, 1,
                    vm.B_RET
                ],
                varCount:1,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            },
            {
                name:"retorna42",
                bytecode:[
                    vm.B_PUSH, 42,
                    vm.B_RETVALUE,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            },
            {
                name:"escreva",
                bytecode:[
                    vm.B_LOAD,0,
                    vm.B_WRITE,
                    vm.B_RET
                ],
                varCount:1,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            },
        ],false,false,false,10,"",saida,false);

        vm.VMrun(10000);

        expect(saida.value).toBe("42");
    });

    test("Leitura de real rejeita texto parcialmente numérico", () => {
        let saida = {value:"",scrollTop:0};
        let erroCallback = jest.fn();

        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_READ_FLOAT,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,erroCallback);

        saida.value = "12abc\n";
        vm.VMrun(10000);

        expect(erroCallback).toHaveBeenCalled();
    });

    test("Leitura de real rejeita infinito", () => {
        let saida = {value:"",scrollTop:0};
        let erroCallback = jest.fn();

        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_READ_FLOAT,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,erroCallback);

        saida.value = "1e309\n";
        vm.VMrun(10000);

        expect(erroCallback).toHaveBeenCalled();
    });

    test("Acesso a vetor não inicializado gera erro amigável", () => {
        let saida = {value:"",scrollTop:0};
        let erroCallback = jest.fn();

        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_PUSH, 0,
                    vm.B_ALOAD, 0, 1,
                    vm.B_RET
                ],
                varCount:1,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,erroCallback);

        vm.VMrun(10000);

        expect(erroCallback).toHaveBeenCalled();
    });

    test("escreva acumula no buffer e flushEscreva atualiza o DOM", () => {
        let saida = {value:"",scrollTop:0,scrollHeight:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_PUSH, "A",
                    vm.B_WRITE,
                    vm.B_PUSH, "B",
                    vm.B_WRITE,
                    vm.B_PUSH, "C",
                    vm.B_WRITE,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,false);

        vm.VMrun(10000);

        // Após VMrun, flushEscreva é chamado no finally, então saida deve ter o resultado completo
        expect(saida.value).toBe("ABC");
    });

    test("Múltiplos B_WRITE não retornam STATE_BREATHING antes de terminar", () => {
        let saida = {value:"",scrollTop:0,scrollHeight:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_PUSH, "1",
                    vm.B_WRITE,
                    vm.B_PUSH, "2",
                    vm.B_WRITE,
                    vm.B_PUSH, "3",
                    vm.B_WRITE,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,false);

        // Com execMax alto, o programa deve terminar sem precisar de breathing
        let state = vm.VMrun(10000);
        expect(state).toBe(vm.STATE_ENDED);
        expect(saida.value).toBe("123");
    });

    test("flushEscreva é idempotente: chamadas repetidas não alteram nada", () => {
        let saida = {value:"",scrollTop:0,scrollHeight:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_PUSH, "test",
                    vm.B_WRITE,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,false);

        vm.VMrun(10000);
        expect(saida.value).toBe("test");

        // Chamar flushEscreva novamente não deve alterar o valor
        vm.flushEscreva();
        expect(saida.value).toBe("test");

        // Chamar mais uma vez continua idempotente
        vm.flushEscreva();
        expect(saida.value).toBe("test");
    });

    test("limpa reseta buffer e atualiza DOM diretamente", () => {
        let saida = {value:"",scrollTop:0,scrollHeight:0};
        vm.VMsetup([
            {
                name:"#globalInit",
                bytecode:[
                    vm.B_PUSH, "antes",
                    vm.B_WRITE,
                    vm.B_CLEAR,
                    vm.B_RET
                ],
                varCount:0,
                parameters:[],
                type:T_vazio,
                jsSafe:true
            }
        ],false,false,false,10,"",saida,false);

        // B_CLEAR retorna STATE_BREATHING, então precisamos chamar mais uma vez
        let state = vm.VMrun(10000);
        expect(state).toBe(vm.STATE_BREATHING);
        // Após o clear, a saída deve estar vazia (limpa atualiza DOM diretamente)
        expect(saida.value).toBe("");

        // Continuar execução: B_RET
        state = vm.VMrun(10000);
        expect(state).toBe(vm.STATE_ENDED);
        expect(saida.value).toBe("");
    });
});