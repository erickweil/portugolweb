import { Tokenizer } from '../js/compiler/tokenizer.js';

import { assert, assertEquals, test } from '/test/test.js'

import { httpGetAsync } from '../js/extras/extras.js';

function erroCounterFn(counterRef) {
    return (input,token,msg,tipo) => {
        console.log("Erro ",tipo," em ",token,":",msg)
        counterRef.value++
    }
}

function tokenizerContarErros(input) {
    let erroCounter = {value:0}

    let tokenizer = new Tokenizer(input,erroCounterFn(erroCounter))
    let tokens = tokenizer.tokenize()

    assert(erroCounter.value == 0)
}

test("Tokenizer programa simples:", () => {
    tokenizerContarErros("programa{funcao inicio(){inteiro a = 4 escreva(\"Valor é\"+a)}")
});

let exemplos = [
    "aleatorio0.por",
    "aleatorio1.por",
    "aleatorio2.por",
    "aleatorio3.por",
    "aleatorio4.por",
    "aleatorio5.por",
    "bibliotecas.por",
    "branco.por",
    "condicoes.por",
    "entrada.por",
    "funcoes.por",
    "graficos.por",
    "internet.por",
    "jogodavida.por",
    "notas.por",
    "olamundo.por",
    "repeticao.por",
    "slide_puzzle.por",
    "variaveis.por",
    "vetores.por"
]

exemplos.forEach((ex) => {
    test("Tokenizer exemplo "+ex+":", () => {
        return httpGetAsync("/exemplos/"+ex, (txt) => {
            tokenizerContarErros(txt)
        });
    });
});
