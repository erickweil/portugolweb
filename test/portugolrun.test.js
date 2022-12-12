import PortugolRuntime from "../js/vm/portugolrun.js";
import { assert, assertEquals, test, testAll } from './test.js';

export function runTests() {
return testAll("portugolrun",

    test("Executnado Hello World:", () => {
        let input = "programa{ funcao inicio(){escreva(\"Olá\")escreva(\" \")escreva(\"Mundo\")} }";

        let run = new PortugolRuntime({value:""});

        let compilado = run.compilar(input,false,false);
        assert(compilado.success);

        return run.executar(input,compilado,false).then((saida) => {
            assertEquals(saida,"Olá Mundo");
        });
    }),

    test("Executando Fibonacci:", () => {
        let input = "programa{ funcao inicio(){inteiro a = 0 inteiro b = 1 enquanto(a<20){a = a + b b = a - b escreva(a,\" \")}}}";

        let run = new PortugolRuntime({value:""});

        let compilado = run.compilar(input,false,false);
        assert(compilado.success);

        return run.executar(input,compilado,false).then((saida) => {
            assertEquals(saida,"1 1 2 3 5 8 13 21 ");
        });
    })
);
}