import { T_vazio } from '../src/compiler/tokenizer.js';
import * as vm from '../src/vm/vm.js';

//import { assert, assertEquals, test, testAll } from './test.js';
import {jest,describe,expect,test} from '@jest/globals';

import { doFetchMock } from './jestmocks.js';
doFetchMock();

describe("Testando VM", () => {

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
        ],false,false,false,"",saida,false);

        vm.VMrun(10000);

        expect(saida.value).toBe("Hello World");
    });
});