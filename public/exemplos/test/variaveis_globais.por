programa
{
    // Variaveis globais declaradas fora de funcoes
    // No novo JsGenerator, sao let no escopo da funcao asincrona externa,
    // acessiveis por closures das funcoes internas.
    inteiro contador = 0
    cadeia ultimo = ""

    funcao inicio()
    {
        incrementar("a")
        incrementar("b")
        incrementar("c")
        escreva(contador,"\n")
        escreva(ultimo,"\n")
        resetar()
        escreva(contador)
    }

    funcao incrementar(cadeia nome)
    {
        contador = contador + 1
        ultimo = nome
    }

    funcao resetar()
    {
        contador = 0
    }
}

/*---
3
c
0
---*/
