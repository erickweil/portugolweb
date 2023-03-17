/* eslint-env node, jest */

import { T_vazio } from '../src/compiler/tokenizer.js';
import * as vm from '../src/compiler/vm/vm.js';

//import { assert, assertEquals, test, testAll } from './test.js';
import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

describe("Testando VM", () => {

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
});