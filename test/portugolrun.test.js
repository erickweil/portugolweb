import PortugolRuntime from "../js/vm/portugolrun.js";
import { assert, assertEquals, test } from '/test/test.js'

test("Executnado Hello World:", () => {
    let input = "programa{ funcao inicio(){escreva(\"Olá\")escreva(\" \")escreva(\"Mundo\")} }"

    let run = new PortugolRuntime()

    return run.executar(input,false).then((saida) => {
        assertEquals(saida,"Olá Mundo")
        proximo()
    })
});

function proximo() {
    test("Executando Fibonacci:", () => {
        let input = "programa{ funcao inicio(){inteiro a = 0 inteiro b = 1 enquanto(a<20){a = a + b b = a - b escreva(a,\" \")}}}"

        let run = new PortugolRuntime()

        return run.executar(input,false).then((saida) => {
            assertEquals(saida,"1 1 2 3 5 8 13 21 ")
        })
    });

}