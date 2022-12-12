import { httpGetAsync } from "../js/extras/extras.js";
import PortugolRuntime from "../js/vm/portugolrun.js";
import { assert, assertEquals, test, testAll } from './test.js';

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
    assert(ex_txt != false);


    const run = new PortugolRuntime({value:""});

    const compilado = run.compilar(input,false,false);
    assert(compilado.success);

    return run.executar(input,compilado,false).then((saida) => {
        if(!saida) return Promise.reject("Saída Vazia");

        assertEquals(saida,ex_txt);
    });
}

function testExemplo(exemplo) {
    return test(exemplo,() => {
        /*return httpGetAsync("/test/programas/"+exemplo, (txt) => {
            execContarErros(txt);
        });*/
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


export function runTests() {
return testAll("portugolrun",

    testExemplo("olamundo.por"),
    testExemplo("fibonacci.por"),
    testExemplo("primos.por")
);
}